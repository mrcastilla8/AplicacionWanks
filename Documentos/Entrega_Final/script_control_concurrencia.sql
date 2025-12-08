/*
    Scripts de Control de Concurrencia
    
    DESCRIPCIÓN:
    Este script demuestra el mecanismo de "Bloqueo Pesimista" (Pessimistic Locking)
    utilizado en el módulo de Checkout del sistema.
    
    Mecanismo utilizado: SELECT ... FOR UPDATE NOWAIT
    Objetivo: Garantizar la integridad del stock y evitar sobreventa durante el proceso de pago.
*/

SET SERVEROUTPUT ON;

DECLARE
  -- Procesar el Carrito ID [X]
  v_carrito_objetivo NUMBER;
  
  -- Cursor explícito con bloqueo
  CURSOR c_bloqueo_items IS
    SELECT producto_id, cantidad
    FROM "APP_OWNER"."CART_ITEMS"
    WHERE carrito_id = v_carrito_objetivo
    FOR UPDATE NOWAIT; 
    
  v_prod_id NUMBER;
  v_cant    NUMBER;
  
  -- Excepción para capturar el recurso ocupado
  e_recurso_ocupado EXCEPTION;
  PRAGMA EXCEPTION_INIT(e_recurso_ocupado, -54); -- ORA-00054
  
BEGIN
  -- 1. Buscamos un carrito activo para la prueba
  SELECT ID INTO v_carrito_objetivo 
  FROM "APP_OWNER"."CARRITOS" 
  WHERE ESTADO = 'activo' 
  FETCH FIRST 1 ROWS ONLY;

  DBMS_OUTPUT.PUT_LINE('=== INICIO DE DEMOSTRACIÓN DE CONCURRENCIA ===');
  DBMS_OUTPUT.PUT_LINE('Intentando procesar el Carrito ID: ' || v_carrito_objetivo);

  -- 2. Intentamos adquirir el bloqueo
  -- Si otra transacción (otra sesión) ya está procesando este carrito,
  -- el DDL FOR UPDATE NOWAIT lanzará error inmediatamente.
  OPEN c_bloqueo_items;
  
  DBMS_OUTPUT.PUT_LINE('> [ÉXITO] Bloqueo adquirido sobre los items del carrito.');
  DBMS_OUTPUT.PUT_LINE('> En este momento, NINGUNA otra sesión puede modificar estos items.');
  DBMS_OUTPUT.PUT_LINE('> El sistema procede a descontar stock y generar pedido...');
  
  -- 3. Simulación de procesamiento (Loop)
  LOOP
    FETCH c_bloqueo_items INTO v_prod_id, v_cant;
    EXIT WHEN c_bloqueo_items%NOTFOUND;
    -- lógica de SP_AJUSTAR_INVENTARIO
    DBMS_OUTPUT.PUT_LINE('  - Procesando Producto ID: ' || v_prod_id || ' (Protegido)');
  END LOOP;
  
  CLOSE c_bloqueo_items;

  -- 4. Finalización
  -- Al hacer COMMIT, se liberan los candados para otros usuarios.
  COMMIT;
  DBMS_OUTPUT.PUT_LINE('> Transacción finalizada. Candados liberados.');
  DBMS_OUTPUT.PUT_LINE('==============================================');

EXCEPTION
  WHEN e_recurso_ocupado THEN
    -- si se detecta un conflicto
    DBMS_OUTPUT.PUT_LINE('!!! ALERTA DE CONCURRENCIA !!!');
    DBMS_OUTPUT.PUT_LINE('El recurso está siendo utilizado por otro usuario.');
    DBMS_OUTPUT.PUT_LINE('Acción: Se impide la sobreescritura y se notifica al usuario.');
    ROLLBACK;
    
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('No hay carritos activos para probar.');
    
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    ROLLBACK;
END;
/