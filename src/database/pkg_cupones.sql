CREATE OR REPLACE PACKAGE PKG_CUPONES AS

    PROCEDURE SP_APLICAR_CUPON(
        p_carrito_id    IN NUMBER,
        p_codigo_cupon  IN VARCHAR2,
        p_resultado     OUT VARCHAR2,
        p_descuento_est OUT NUMBER  
    );

    PROCEDURE SP_REMOVER_CUPON(
        p_carrito_id    IN NUMBER,
        p_resultado     OUT VARCHAR2
    );

    FUNCTION FN_VALIDAR_CUPON(
        p_codigo_cupon IN VARCHAR2,
        p_subtotal     IN NUMBER,
        p_usuario_id   IN NUMBER DEFAULT NULL
    ) RETURN VARCHAR2; 

END PKG_CUPONES;
/

CREATE OR REPLACE PACKAGE BODY PKG_CUPONES AS

    FUNCTION FN_VALIDAR_CUPON(
        p_codigo_cupon IN VARCHAR2,
        p_subtotal     IN NUMBER,
        p_usuario_id   IN NUMBER DEFAULT NULL
    ) RETURN VARCHAR2 IS
        v_cupon cupones%ROWTYPE;
        v_usos_global NUMBER;
        v_usos_user   NUMBER;
    BEGIN
        BEGIN
            SELECT * INTO v_cupon FROM cupones WHERE codigo = p_codigo_cupon;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN RETURN 'El cupón no existe';
        END;

        IF v_cupon.activo <> 'S' THEN RETURN 'El cupón está inactivo'; END IF;

        IF v_cupon.vigente_desde IS NOT NULL AND SYSTIMESTAMP < v_cupon.vigente_desde THEN
            RETURN 'El cupón aún no está vigente';
        END IF;
        IF v_cupon.vigente_hasta IS NOT NULL AND SYSTIMESTAMP > v_cupon.vigente_hasta THEN
            RETURN 'El cupón ha expirado';
        END IF;

        IF v_cupon.subtotal_minimo IS NOT NULL AND p_subtotal < v_cupon.subtotal_minimo THEN
            RETURN 'El subtotal mínimo para este cupón es ' || v_cupon.subtotal_minimo;
        END IF;

        IF v_cupon.usos_maximos_global IS NOT NULL THEN
            SELECT COUNT(1) INTO v_usos_global FROM redenciones_cupones WHERE cupon_id = v_cupon.id;
            IF v_usos_global >= v_cupon.usos_maximos_global THEN
                RETURN 'Este cupón ya agotó su cantidad de usos globales';
            END IF;
        END IF;

        IF p_usuario_id IS NOT NULL AND v_cupon.usos_maximos_por_usuario IS NOT NULL THEN
            SELECT COUNT(1) INTO v_usos_user 
            FROM redenciones_cupones 
            WHERE cupon_id = v_cupon.id AND usuario_id = p_usuario_id;
            
            IF v_usos_user >= v_cupon.usos_maximos_por_usuario THEN
                RETURN 'Ya has usado este cupón el máximo de veces permitido';
            END IF;
        END IF;

        RETURN 'OK';
    END;

    PROCEDURE SP_APLICAR_CUPON(
        p_carrito_id    IN NUMBER,
        p_codigo_cupon  IN VARCHAR2,
        p_resultado     OUT VARCHAR2,
        p_descuento_est OUT NUMBER
    ) IS
        v_subtotal   NUMBER;
        v_perfil_id  NUMBER;
        v_msg_valid  VARCHAR2(200);
        v_cupon_id   NUMBER;
        v_tipo       VARCHAR2(20);
        v_valor      NUMBER;
    BEGIN
        p_descuento_est := 0;

        BEGIN
            -- Usamos la vista VW_DETALLE_CARRITO que ya tienes para obtener el subtotal calculado
            SELECT subtotal_estimado, perfil_id 
            INTO v_subtotal, v_perfil_id
            FROM vw_detalle_carrito 
            WHERE carrito_id = p_carrito_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                p_resultado := 'Carrito no encontrado';
                RETURN;
        END;

        v_msg_valid := FN_VALIDAR_CUPON(p_codigo_cupon, v_subtotal, v_perfil_id);
        
        IF v_msg_valid <> 'OK' THEN
            UPDATE carritos SET cupon_id = NULL, actualizado_en = SYSTIMESTAMP WHERE id = p_carrito_id;
            p_resultado := v_msg_valid;
            RETURN;
        END IF;

        SELECT id, tipo_descuento, valor_descuento 
        INTO v_cupon_id, v_tipo, v_valor
        FROM cupones WHERE codigo = p_codigo_cupon;

        IF v_tipo = 'monto' THEN
            p_descuento_est := LEAST(v_subtotal, v_valor);
        ELSIF v_tipo = 'porcentaje' THEN
            p_descuento_est := ROUND(v_subtotal * (v_valor / 100), 2);
        END IF;

        UPDATE carritos 
        SET cupon_id = v_cupon_id, 
            actualizado_en = SYSTIMESTAMP 
        WHERE id = p_carrito_id;

        p_resultado := 'OK';
        COMMIT;

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            p_resultado := 'Error interno: ' || SQLERRM;
    END;


    PROCEDURE SP_REMOVER_CUPON(p_carrito_id IN NUMBER, p_resultado OUT VARCHAR2) IS
    BEGIN
        UPDATE carritos 
        SET cupon_id = NULL, 
            actualizado_en = SYSTIMESTAMP 
        WHERE id = p_carrito_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            p_resultado := 'Carrito no encontrado';
        ELSE
            p_resultado := 'OK';
            COMMIT;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            p_resultado := 'Error: ' || SQLERRM;
    END;

END PKG_CUPONES;
/
