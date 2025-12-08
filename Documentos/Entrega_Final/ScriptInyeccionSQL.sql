-- -----------------------------------------------------------------------------
--                      Scripts de Inyección de SQL
-- -----------------------------------------------------------------------------
-- CASO 01
-- -----------------------------------------------------------------------------
-- Escenario vulnerable: Login inseguro - Tabla objetivo: PERFILES
SET SERVEROUTPUT ON;
CREATE OR REPLACE PROCEDURE SP_LOGIN_INSEGURO (
    p_correo IN VARCHAR2,
    p_password IN VARCHAR2
) IS
    v_count NUMBER;
    v_sql VARCHAR2(1000);
BEGIN
    v_sql := 'SELECT COUNT(*) FROM PERFILES WHERE CORREO = ''' || p_correo || '''';
    
    DBMS_OUTPUT.PUT_LINE('Ejecutando Query: ' || v_sql);
    EXECUTE IMMEDIATE v_sql INTO v_count;
    
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('ACCESO CONCEDIDO: Bienvenido al sistema.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('ACCESO DENEGADO: Credenciales incorrectas.');
    END IF;
END;
/

-- Script de ataque: Script que intenta engañar al sistema para ingresar sin contraseña
SET SERVEROUTPUT ON;
DECLARE
    v_usuario_hacker VARCHAR2(100);
BEGIN
    DBMS_OUTPUT.PUT_LINE('Intento de hackeo');
    
    -- Se inyecta código malicioso en el campo de correo
    -- Esto transforma la query interna en: SELECT ... WHERE CORREO = 'x' OR '1'='1'
    v_usuario_hacker := 'hack'' OR ''1''=''1';
    
    SP_LOGIN_INSEGURO(v_usuario_hacker, 'contraseñaInvalida');
END;
/

-- Escenario seguro: Uso de using
CREATE OR REPLACE PROCEDURE SP_LOGIN_SEGURO (
    p_correo IN VARCHAR2
) IS
    v_count NUMBER;
    v_sql VARCHAR2(1000);
BEGIN
    v_sql := 'SELECT COUNT(*) FROM PERFILES WHERE CORREO = :1';
    
    EXECUTE IMMEDIATE v_sql INTO v_count USING p_correo;
    
    IF v_count > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Login Exitoso (Usuario Real)');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Login Fallido (Usuario no encontrado)');
    END IF;
END;
/

-- Validación final
BEGIN
    DBMS_OUTPUT.PUT_LINE('Intento de hackeo al login seguro');
    SP_LOGIN_SEGURO('hack'' OR ''1''=''1');
END;
/

-- -----------------------------------------------------------------------------
-- CASO 02
-- -----------------------------------------------------------------------------
-- Escenario vulnerable: Robo de información - Tabla objetivo: Productos
CREATE OR REPLACE PROCEDURE SP_BUSCAR_PRODUCTO_INSEGURO (
    p_termino IN VARCHAR2
) IS
    v_sql VARCHAR2(4000);
    
    TYPE t_cursor IS REF CURSOR;
    v_cursor t_cursor;
    v_columna1 VARCHAR2(255); 
    v_columna2 VARCHAR2(255);
BEGIN
    v_sql := 'SELECT nombre_es, TO_CHAR(precio) FROM PRODUCTOS WHERE nombre_es LIKE ''%' || p_termino || '%''';
    DBMS_OUTPUT.PUT_LINE('Ejecutando SQL Interno: ' || v_sql);
    OPEN v_cursor FOR v_sql;
    LOOP
        FETCH v_cursor INTO v_columna1, v_columna2;
        EXIT WHEN v_cursor%NOTFOUND;
        -- Imprimimos el "Producto" encontrado
        DBMS_OUTPUT.PUT_LINE('Resultado: ' || v_columna1 || ' | Precio/Dato: ' || v_columna2);
    END LOOP;
    CLOSE v_cursor;
END;
/

-- Script de ataque: Script que intenta acceder a la tabla perfiles a través de productos
SET SERVEROUTPUT ON;

DECLARE
    v_busqueda_maliciosa VARCHAR2(200) := 'ZZZZ'' UNION SELECT nombre, correo FROM PERFILES --';
BEGIN
    DBMS_OUTPUT.PUT_LINE('Iniciando ataque de exfiltración de datos');
    
    SP_BUSCAR_PRODUCTO_INSEGURO(v_busqueda_maliciosa);
END;
/

-- Escenario seguro: Usando Bind Variables
CREATE OR REPLACE PROCEDURE SP_BUSCAR_PRODUCTO_SEGURO (
    p_termino IN VARCHAR2
) IS
    v_sql VARCHAR2(4000);
    TYPE t_cursor IS REF CURSOR;
    v_cursor t_cursor;
    v_columna1 VARCHAR2(255);
    v_columna2 VARCHAR2(255);
BEGIN
    v_sql := 'SELECT nombre_es, TO_CHAR(precio) FROM PRODUCTOS WHERE nombre_es LIKE ''%'' || :1 || ''%''';
    DBMS_OUTPUT.PUT_LINE('Ejecutando SQL Seguro: ' || v_sql);
    OPEN v_cursor FOR v_sql USING p_termino;
    LOOP
        FETCH v_cursor INTO v_columna1, v_columna2;
        EXIT WHEN v_cursor%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE('Resultado: ' || v_columna1 || ' | Precio: ' || v_columna2);
    END LOOP;
    CLOSE v_cursor;
END;
/

-- Validación final
SET SERVEROUTPUT ON;

DECLARE
    v_busqueda_maliciosa VARCHAR2(200) := 'ZZZZ'' UNION SELECT nombre, correo FROM PERFILES --';
BEGIN
    DBMS_OUTPUT.PUT_LINE('Intento de ataque al sistema blindado');
    
    SP_BUSCAR_PRODUCTO_SEGURO(v_busqueda_maliciosa);
    DBMS_OUTPUT.PUT_LINE('Sin mostrar usuarios; el sistema es SEGURO.');
END;
/