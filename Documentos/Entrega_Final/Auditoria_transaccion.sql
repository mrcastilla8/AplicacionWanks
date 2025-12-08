-- =========================================================
--  Scripts de Auditoría de Transacciones
--  Esquema: APP_OWNER
--  Fecha: 2025-12-07
-- =========================================================

-- =========================================================
-- PARTE 1: TABLA DE AUDITORÍA CENTRAL
-- =========================================================

CREATE TABLE APP_OWNER.AUDITORIA_TRANSACCIONES (
  ID               NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  TABLA_NOMBRE     VARCHAR2(100)   NOT NULL,
  OPERACION        VARCHAR2(10)    NOT NULL,
  REGISTRO_ID      NUMBER,
  DATOS_ANTERIORES CLOB,
  DATOS_NUEVOS     CLOB,
  USUARIO_BD       VARCHAR2(100)   DEFAULT USER,
  USUARIO_APP      NUMBER,
  FECHA_HORA       TIMESTAMP(6) WITH TIME ZONE DEFAULT SYSTIMESTAMP
);

-- =========================================================
-- PARTE 2: TRIGGERS DE AUDITORÍA
-- =========================================================

-- ---------------------------------------------------------
-- Trigger: PEDIDOS
-- ---------------------------------------------------------
CREATE OR REPLACE TRIGGER APP_OWNER.TRG_AUD_PEDIDOS
AFTER INSERT OR UPDATE OR DELETE ON APP_OWNER.PEDIDOS
FOR EACH ROW
DECLARE
  v_operacion VARCHAR2(10);
  v_datos_ant CLOB;
  v_datos_new CLOB;
  v_registro_id NUMBER;
BEGIN
  IF INSERTING THEN 
    v_operacion := 'INSERT';
    v_registro_id := :NEW.ID;
  ELSIF UPDATING THEN 
    v_operacion := 'UPDATE';
    v_registro_id := :NEW.ID;
  ELSE 
    v_operacion := 'DELETE';
    v_registro_id := :OLD.ID;
  END IF;
  
  IF UPDATING OR DELETING THEN
    v_datos_ant := '{' ||
      '"id":' || NVL(TO_CHAR(:OLD.ID), 'null') || ',' ||
      '"usuario_id":' || NVL(TO_CHAR(:OLD.USUARIO_ID), 'null') || ',' ||
      '"local_id":' || NVL(TO_CHAR(:OLD.LOCAL_ID), 'null') || ',' ||
      '"estado":"' || NVL(:OLD.ESTADO, '') || '",' ||
      '"total_precio":' || NVL(TO_CHAR(:OLD.TOTAL_PRECIO), 'null') ||
    '}';
  END IF;
  
  IF INSERTING OR UPDATING THEN
    v_datos_new := '{' ||
      '"id":' || NVL(TO_CHAR(:NEW.ID), 'null') || ',' ||
      '"usuario_id":' || NVL(TO_CHAR(:NEW.USUARIO_ID), 'null') || ',' ||
      '"local_id":' || NVL(TO_CHAR(:NEW.LOCAL_ID), 'null') || ',' ||
      '"estado":"' || NVL(:NEW.ESTADO, '') || '",' ||
      '"total_precio":' || NVL(TO_CHAR(:NEW.TOTAL_PRECIO), 'null') ||
    '}';
  END IF;
  
  INSERT INTO APP_OWNER.AUDITORIA_TRANSACCIONES 
    (TABLA_NOMBRE, OPERACION, REGISTRO_ID, DATOS_ANTERIORES, DATOS_NUEVOS, USUARIO_APP)
  VALUES 
    ('PEDIDOS', v_operacion, v_registro_id, v_datos_ant, v_datos_new, NVL(:NEW.USUARIO_ID, :OLD.USUARIO_ID));
END;
/

-- ---------------------------------------------------------
-- Trigger: DETALLE_PEDIDOS
-- ---------------------------------------------------------
CREATE OR REPLACE TRIGGER APP_OWNER.TRG_AUD_DETALLE_PEDIDOS
AFTER INSERT OR UPDATE OR DELETE ON APP_OWNER.DETALLE_PEDIDOS
FOR EACH ROW
DECLARE
  v_operacion VARCHAR2(10);
  v_datos_ant CLOB;
  v_datos_new CLOB;
  v_registro_id NUMBER;
BEGIN
  IF INSERTING THEN 
    v_operacion := 'INSERT';
    v_registro_id := :NEW.ID;
  ELSIF UPDATING THEN 
    v_operacion := 'UPDATE';
    v_registro_id := :NEW.ID;
  ELSE 
    v_operacion := 'DELETE';
    v_registro_id := :OLD.ID;
  END IF;
  
  IF UPDATING OR DELETING THEN
    v_datos_ant := '{' ||
      '"id":' || NVL(TO_CHAR(:OLD.ID), 'null') || ',' ||
      '"pedido_id":' || NVL(TO_CHAR(:OLD.PEDIDO_ID), 'null') || ',' ||
      '"producto_id":' || NVL(TO_CHAR(:OLD.PRODUCTO_ID), 'null') || ',' ||
      '"variante_id":' || NVL(TO_CHAR(:OLD.VARIANTE_ID), 'null') || ',' ||
      '"cantidad":' || NVL(TO_CHAR(:OLD.CANTIDAD), 'null') || ',' ||
      '"precio_unitario":' || NVL(TO_CHAR(:OLD.PRECIO_UNITARIO), 'null') ||
    '}';
  END IF;
  
  IF INSERTING OR UPDATING THEN
    v_datos_new := '{' ||
      '"id":' || NVL(TO_CHAR(:NEW.ID), 'null') || ',' ||
      '"pedido_id":' || NVL(TO_CHAR(:NEW.PEDIDO_ID), 'null') || ',' ||
      '"producto_id":' || NVL(TO_CHAR(:NEW.PRODUCTO_ID), 'null') || ',' ||
      '"variante_id":' || NVL(TO_CHAR(:NEW.VARIANTE_ID), 'null') || ',' ||
      '"cantidad":' || NVL(TO_CHAR(:NEW.CANTIDAD), 'null') || ',' ||
      '"precio_unitario":' || NVL(TO_CHAR(:NEW.PRECIO_UNITARIO), 'null') ||
    '}';
  END IF;
  
  INSERT INTO APP_OWNER.AUDITORIA_TRANSACCIONES 
    (TABLA_NOMBRE, OPERACION, REGISTRO_ID, DATOS_ANTERIORES, DATOS_NUEVOS)
  VALUES 
    ('DETALLE_PEDIDOS', v_operacion, v_registro_id, v_datos_ant, v_datos_new);
END;
/

-- ---------------------------------------------------------
-- Trigger: FACTURAS
-- ---------------------------------------------------------
CREATE OR REPLACE TRIGGER APP_OWNER.TRG_AUD_FACTURAS
AFTER INSERT OR UPDATE OR DELETE ON APP_OWNER.FACTURAS
FOR EACH ROW
DECLARE
  v_operacion VARCHAR2(10);
  v_datos_ant CLOB;
  v_datos_new CLOB;
  v_registro_id NUMBER;
BEGIN
  IF INSERTING THEN 
    v_operacion := 'INSERT';
    v_registro_id := :NEW.ID;
  ELSIF UPDATING THEN 
    v_operacion := 'UPDATE';
    v_registro_id := :NEW.ID;
  ELSE 
    v_operacion := 'DELETE';
    v_registro_id := :OLD.ID;
  END IF;
  
  IF UPDATING OR DELETING THEN
    v_datos_ant := '{' ||
      '"id":' || NVL(TO_CHAR(:OLD.ID), 'null') || ',' ||
      '"pedido_id":' || NVL(TO_CHAR(:OLD.PEDIDO_ID), 'null') || ',' ||
      '"numero":"' || NVL(:OLD.NUMERO, '') || '",' ||
      '"subtotal":' || NVL(TO_CHAR(:OLD.SUBTOTAL), 'null') || ',' ||
      '"descuento_total":' || NVL(TO_CHAR(:OLD.DESCUENTO_TOTAL), 'null') || ',' ||
      '"total_general":' || NVL(TO_CHAR(:OLD.TOTAL_GENERAL), 'null') ||
    '}';
  END IF;
  
  IF INSERTING OR UPDATING THEN
    v_datos_new := '{' ||
      '"id":' || NVL(TO_CHAR(:NEW.ID), 'null') || ',' ||
      '"pedido_id":' || NVL(TO_CHAR(:NEW.PEDIDO_ID), 'null') || ',' ||
      '"numero":"' || NVL(:NEW.NUMERO, '') || '",' ||
      '"subtotal":' || NVL(TO_CHAR(:NEW.SUBTOTAL), 'null') || ',' ||
      '"descuento_total":' || NVL(TO_CHAR(:NEW.DESCUENTO_TOTAL), 'null') || ',' ||
      '"total_general":' || NVL(TO_CHAR(:NEW.TOTAL_GENERAL), 'null') ||
    '}';
  END IF;
  
  INSERT INTO APP_OWNER.AUDITORIA_TRANSACCIONES 
    (TABLA_NOMBRE, OPERACION, REGISTRO_ID, DATOS_ANTERIORES, DATOS_NUEVOS)
  VALUES 
    ('FACTURAS', v_operacion, v_registro_id, v_datos_ant, v_datos_new);
END;
/

-- ---------------------------------------------------------
-- Trigger: MOVIMIENTOS_INVENTARIO
-- ---------------------------------------------------------
CREATE OR REPLACE TRIGGER APP_OWNER.TRG_AUD_MOVIMIENTOS_INV
AFTER INSERT OR UPDATE OR DELETE ON APP_OWNER.MOVIMIENTOS_INVENTARIO
FOR EACH ROW
DECLARE
  v_operacion VARCHAR2(10);
  v_datos_ant CLOB;
  v_datos_new CLOB;
  v_registro_id NUMBER;
BEGIN
  IF INSERTING THEN 
    v_operacion := 'INSERT';
    v_registro_id := :NEW.ID;
  ELSIF UPDATING THEN 
    v_operacion := 'UPDATE';
    v_registro_id := :NEW.ID;
  ELSE 
    v_operacion := 'DELETE';
    v_registro_id := :OLD.ID;
  END IF;
  
  IF UPDATING OR DELETING THEN
    v_datos_ant := '{' ||
      '"id":' || NVL(TO_CHAR(:OLD.ID), 'null') || ',' ||
      '"variante_producto_id":' || NVL(TO_CHAR(:OLD.VARIANTE_PRODUCTO_ID), 'null') || ',' ||
      '"tipo_movimiento":"' || NVL(:OLD.TIPO_MOVIMIENTO, '') || '",' ||
      '"cantidad":' || NVL(TO_CHAR(:OLD.CANTIDAD), 'null') || ',' ||
      '"tipo_referencia":"' || NVL(:OLD.TIPO_REFERENCIA, '') || '",' ||
      '"referencia_id":' || NVL(TO_CHAR(:OLD.REFERENCIA_ID), 'null') ||
    '}';
  END IF;
  
  IF INSERTING OR UPDATING THEN
    v_datos_new := '{' ||
      '"id":' || NVL(TO_CHAR(:NEW.ID), 'null') || ',' ||
      '"variante_producto_id":' || NVL(TO_CHAR(:NEW.VARIANTE_PRODUCTO_ID), 'null') || ',' ||
      '"tipo_movimiento":"' || NVL(:NEW.TIPO_MOVIMIENTO, '') || '",' ||
      '"cantidad":' || NVL(TO_CHAR(:NEW.CANTIDAD), 'null') || ',' ||
      '"tipo_referencia":"' || NVL(:NEW.TIPO_REFERENCIA, '') || '",' ||
      '"referencia_id":' || NVL(TO_CHAR(:NEW.REFERENCIA_ID), 'null') ||
    '}';
  END IF;
  
  INSERT INTO APP_OWNER.AUDITORIA_TRANSACCIONES 
    (TABLA_NOMBRE, OPERACION, REGISTRO_ID, DATOS_ANTERIORES, DATOS_NUEVOS)
  VALUES 
    ('MOVIMIENTOS_INVENTARIO', v_operacion, v_registro_id, v_datos_ant, v_datos_new);
END;
/

-- ---------------------------------------------------------
-- Trigger: DEVOLUCIONES
-- ---------------------------------------------------------
CREATE OR REPLACE TRIGGER APP_OWNER.TRG_AUD_DEVOLUCIONES
AFTER INSERT OR UPDATE OR DELETE ON APP_OWNER.DEVOLUCIONES
FOR EACH ROW
DECLARE
  v_operacion VARCHAR2(10);
  v_datos_ant CLOB;
  v_datos_new CLOB;
  v_registro_id NUMBER;
BEGIN
  IF INSERTING THEN 
    v_operacion := 'INSERT';
    v_registro_id := :NEW.ID;
  ELSIF UPDATING THEN 
    v_operacion := 'UPDATE';
    v_registro_id := :NEW.ID;
  ELSE 
    v_operacion := 'DELETE';
    v_registro_id := :OLD.ID;
  END IF;
  
  IF UPDATING OR DELETING THEN
    v_datos_ant := '{' ||
      '"id":' || NVL(TO_CHAR(:OLD.ID), 'null') || ',' ||
      '"pedido_id":' || NVL(TO_CHAR(:OLD.PEDIDO_ID), 'null') || ',' ||
      '"estado":"' || NVL(:OLD.ESTADO, '') || '",' ||
      '"codigo_motivo":"' || NVL(:OLD.CODIGO_MOTIVO, '') || '"' ||
    '}';
  END IF;
  
  IF INSERTING OR UPDATING THEN
    v_datos_new := '{' ||
      '"id":' || NVL(TO_CHAR(:NEW.ID), 'null') || ',' ||
      '"pedido_id":' || NVL(TO_CHAR(:NEW.PEDIDO_ID), 'null') || ',' ||
      '"estado":"' || NVL(:NEW.ESTADO, '') || '",' ||
      '"codigo_motivo":"' || NVL(:NEW.CODIGO_MOTIVO, '') || '"' ||
    '}';
  END IF;
  
  INSERT INTO APP_OWNER.AUDITORIA_TRANSACCIONES 
    (TABLA_NOMBRE, OPERACION, REGISTRO_ID, DATOS_ANTERIORES, DATOS_NUEVOS)
  VALUES 
    ('DEVOLUCIONES', v_operacion, v_registro_id, v_datos_ant, v_datos_new);
END;
/

-- ---------------------------------------------------------
-- Trigger: PERFILES
-- ---------------------------------------------------------
CREATE OR REPLACE TRIGGER APP_OWNER.TRG_AUD_PERFILES
AFTER INSERT OR UPDATE OR DELETE ON APP_OWNER.PERFILES
FOR EACH ROW
DECLARE
  v_operacion VARCHAR2(10);
  v_datos_ant CLOB;
  v_datos_new CLOB;
  v_registro_id NUMBER;
BEGIN
  IF INSERTING THEN 
    v_operacion := 'INSERT';
    v_registro_id := :NEW.ID;
  ELSIF UPDATING THEN 
    v_operacion := 'UPDATE';
    v_registro_id := :NEW.ID;
  ELSE 
    v_operacion := 'DELETE';
    v_registro_id := :OLD.ID;
  END IF;
  
  -- NOTA: No se registra CONTRASENA_HASH por seguridad
  IF UPDATING OR DELETING THEN
    v_datos_ant := '{' ||
      '"id":' || NVL(TO_CHAR(:OLD.ID), 'null') || ',' ||
      '"nombre":"' || NVL(REPLACE(:OLD.NOMBRE, '"', '\"'), '') || '",' ||
      '"correo":"' || NVL(:OLD.CORREO, '') || '",' ||
      '"telefono":"' || NVL(:OLD.TELEFONO, '') || '",' ||
      '"rol":"' || NVL(:OLD.ROL, '') || '"' ||
    '}';
  END IF;
  
  IF INSERTING OR UPDATING THEN
    v_datos_new := '{' ||
      '"id":' || NVL(TO_CHAR(:NEW.ID), 'null') || ',' ||
      '"nombre":"' || NVL(REPLACE(:NEW.NOMBRE, '"', '\"'), '') || '",' ||
      '"correo":"' || NVL(:NEW.CORREO, '') || '",' ||
      '"telefono":"' || NVL(:NEW.TELEFONO, '') || '",' ||
      '"rol":"' || NVL(:NEW.ROL, '') || '"' ||
    '}';
  END IF;
  
  INSERT INTO APP_OWNER.AUDITORIA_TRANSACCIONES 
    (TABLA_NOMBRE, OPERACION, REGISTRO_ID, DATOS_ANTERIORES, DATOS_NUEVOS, USUARIO_APP)
  VALUES 
    ('PERFILES', v_operacion, v_registro_id, v_datos_ant, v_datos_new, v_registro_id);
END;
/

-- ---------------------------------------------------------
-- Trigger: CUPONES
-- ---------------------------------------------------------
CREATE OR REPLACE TRIGGER APP_OWNER.TRG_AUD_CUPONES
AFTER INSERT OR UPDATE OR DELETE ON APP_OWNER.CUPONES
FOR EACH ROW
DECLARE
  v_operacion VARCHAR2(10);
  v_datos_ant CLOB;
  v_datos_new CLOB;
  v_registro_id NUMBER;
BEGIN
  IF INSERTING THEN 
    v_operacion := 'INSERT';
    v_registro_id := :NEW.ID;
  ELSIF UPDATING THEN 
    v_operacion := 'UPDATE';
    v_registro_id := :NEW.ID;
  ELSE 
    v_operacion := 'DELETE';
    v_registro_id := :OLD.ID;
  END IF;
  
  IF UPDATING OR DELETING THEN
    v_datos_ant := '{' ||
      '"id":' || NVL(TO_CHAR(:OLD.ID), 'null') || ',' ||
      '"codigo":"' || NVL(:OLD.CODIGO, '') || '",' ||
      '"tipo_descuento":"' || NVL(:OLD.TIPO_DESCUENTO, '') || '",' ||
      '"valor_descuento":' || NVL(TO_CHAR(:OLD.VALOR_DESCUENTO), 'null') || ',' ||
      '"activo":"' || NVL(:OLD.ACTIVO, '') || '"' ||
    '}';
  END IF;
  
  IF INSERTING OR UPDATING THEN
    v_datos_new := '{' ||
      '"id":' || NVL(TO_CHAR(:NEW.ID), 'null') || ',' ||
      '"codigo":"' || NVL(:NEW.CODIGO, '') || '",' ||
      '"tipo_descuento":"' || NVL(:NEW.TIPO_DESCUENTO, '') || '",' ||
      '"valor_descuento":' || NVL(TO_CHAR(:NEW.VALOR_DESCUENTO), 'null') || ',' ||
      '"activo":"' || NVL(:NEW.ACTIVO, '') || '"' ||
    '}';
  END IF;
  
  INSERT INTO APP_OWNER.AUDITORIA_TRANSACCIONES 
    (TABLA_NOMBRE, OPERACION, REGISTRO_ID, DATOS_ANTERIORES, DATOS_NUEVOS)
  VALUES 
    ('CUPONES', v_operacion, v_registro_id, v_datos_ant, v_datos_new);
END;
/

-- =========================================================
-- PARTE 3: ÍNDICES DE RENDIMIENTO
-- =========================================================

CREATE INDEX APP_OWNER.IDX_AUD_TABLA 
  ON APP_OWNER.AUDITORIA_TRANSACCIONES(TABLA_NOMBRE);

CREATE INDEX APP_OWNER.IDX_AUD_FECHA 
  ON APP_OWNER.AUDITORIA_TRANSACCIONES(FECHA_HORA);

CREATE INDEX APP_OWNER.IDX_AUD_REGISTRO 
  ON APP_OWNER.AUDITORIA_TRANSACCIONES(TABLA_NOMBRE, REGISTRO_ID);

CREATE INDEX APP_OWNER.IDX_AUD_USUARIO 
  ON APP_OWNER.AUDITORIA_TRANSACCIONES(USUARIO_APP);

-- =========================================================
-- PARTE 4: VISTAS DE CONSULTA
-- =========================================================

-- Vista: Auditoría de Pedidos con información legible
CREATE OR REPLACE VIEW APP_OWNER.VW_AUDITORIA_PEDIDOS AS
SELECT
  a.ID AS AUDITORIA_ID,
  a.OPERACION,
  a.REGISTRO_ID AS PEDIDO_ID,
  JSON_VALUE(a.DATOS_ANTERIORES, '$.estado') AS ESTADO_ANTERIOR,
  JSON_VALUE(a.DATOS_NUEVOS, '$.estado') AS ESTADO_NUEVO,
  JSON_VALUE(a.DATOS_ANTERIORES, '$.total_precio') AS TOTAL_ANTERIOR,
  JSON_VALUE(a.DATOS_NUEVOS, '$.total_precio') AS TOTAL_NUEVO,
  a.USUARIO_BD,
  a.USUARIO_APP,
  p.NOMBRE AS NOMBRE_USUARIO,
  a.FECHA_HORA
FROM APP_OWNER.AUDITORIA_TRANSACCIONES a
LEFT JOIN APP_OWNER.PERFILES p ON a.USUARIO_APP = p.ID
WHERE a.TABLA_NOMBRE = 'PEDIDOS'
ORDER BY a.FECHA_HORA DESC;

-- Vista: Resumen diario de operaciones
CREATE OR REPLACE VIEW APP_OWNER.VW_AUDITORIA_RESUMEN_DIARIO AS
SELECT
  TRUNC(CAST(FECHA_HORA AS DATE)) AS FECHA,
  TABLA_NOMBRE,
  OPERACION,
  COUNT(*) AS CANTIDAD
FROM APP_OWNER.AUDITORIA_TRANSACCIONES
GROUP BY TRUNC(CAST(FECHA_HORA AS DATE)), TABLA_NOMBRE, OPERACION
ORDER BY FECHA DESC, TABLA_NOMBRE, OPERACION;

-- Vista: Últimos cambios (últimas 24 horas)
CREATE OR REPLACE VIEW APP_OWNER.VW_AUDITORIA_RECIENTE AS
SELECT
  ID,
  TABLA_NOMBRE,
  OPERACION,
  REGISTRO_ID,
  USUARIO_BD,
  USUARIO_APP,
  FECHA_HORA
FROM APP_OWNER.AUDITORIA_TRANSACCIONES
WHERE FECHA_HORA >= SYSTIMESTAMP - INTERVAL '24' HOUR
ORDER BY FECHA_HORA DESC;

-- =========================================================
-- FIN DEL SCRIPT DE AUDITORÍA
-- =========================================================
