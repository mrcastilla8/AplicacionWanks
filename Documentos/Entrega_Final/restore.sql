--------------------------------------------------------
-- SCRIPT DE RESTAURACIÓN (Para correr en SQL Developer)
-- Autor: Generado por IA para APP_OWNER
--------------------------------------------------------
SET SERVEROUTPUT ON;
SET DEFINE OFF; -- Evita que el símbolo '&' pida variables

-- 1. PREPARACIÓN: Borrar el esquema anterior para evitar errores de "ya existe"
-- ¡CUIDADO! Esto elimina los datos actuales para poner los del backup.
DECLARE
    v_user_exists NUMBER;
BEGIN
    SELECT count(*) INTO v_user_exists FROM dba_users WHERE username = 'APP_OWNER';
    IF v_user_exists > 0 THEN
        EXECUTE IMMEDIATE 'DROP USER APP_OWNER CASCADE';
        DBMS_OUTPUT.PUT_LINE('Usuario APP_OWNER eliminado correctamente.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Aviso: No se pudo eliminar el usuario (quizás está conectado).');
END;
/

-- 2. CREACIÓN: Crear el usuario limpio
CREATE USER APP_OWNER IDENTIFIED BY "TuPassword123" 
DEFAULT TABLESPACE USERS QUOTA UNLIMITED ON USERS;

GRANT CONNECT, RESOURCE, DBA TO APP_OWNER;
DBMS_OUTPUT.PUT_LINE('Usuario APP_OWNER recreado.');

-- 3. EJECUCIÓN: Conectar y correr el backup
-- NOTA: En SQL Developer, la forma más fácil de seguir es abrir
-- una NUEVA hoja de trabajo con la conexión "APP_OWNER" y pegar 
-- el contenido de tu 'scriptcompleto.sql' allí.
-- O, si usas la ruta de archivo (recomendado):

CONN APP_OWNER/"TuPassword123"@localhost:1521/xepdb1; -- Ajusta tu conexión aquí

-- Aquí llamamos a tu archivo gigante. 
-- Asegúrate de poner la ruta correcta donde guardaste tu script exportado:
@C:\Ruta\De\Tu\Archivo\scriptcompleto.sql;

PROMPT Restauración Finalizada con Éxito.