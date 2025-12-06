-- =============================================================================
-- SCRIPT: Actualización de Precios de Variantes de Productos
-- Descripción: Actualiza el campo PRECIO_SOBRESCRITO en VARIANTES_PRODUCTO
--              para diferenciar precios según tamaño/presentación
-- Fecha: 2025-12-05
-- =============================================================================

SET DEFINE OFF;

-- ============================================================================
-- PRODUCTO 1: Tuna Roja (Precio base: S/5)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'SKU-1';      -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 25 WHERE SKU = 'TUNA-1KG'; -- 1 kg (aprox 6-8 unds)

-- ============================================================================
-- PRODUCTO 2: Hamburguesas de Res (Precio base: S/12)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12 WHERE SKU = 'SKU-2';        -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 35 WHERE SKU = 'HAMBURG-CAJA6';  -- Caja 6 unidades
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 65 WHERE SKU = 'HAMBURG-CAJA12'; -- Caja 12 unidades

-- ============================================================================
-- PRODUCTO 3: Plátano de Seda (Precio base: S/4.80)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1 WHERE SKU = 'SKU-3';        -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.80 WHERE SKU = 'PLATANO-MANO'; -- Mano (aprox 1kg)

-- ============================================================================
-- PRODUCTO 4: Pisco Quebranta (Precio base: S/55)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 55 WHERE SKU = 'SKU-4';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 55 WHERE SKU = 'PISCO-750ML'; -- Botella 750ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 95 WHERE SKU = 'PISCO-2L';    -- Botella 2 Litros

-- ============================================================================
-- PRODUCTO 5: Cerveza Cristal (Precio base: S/4.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'SKU-5';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'CRISTAL-355ML'; -- Lata 355ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'CRISTAL-473ML'; -- Lata 473ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'CRISTAL-650ML'; -- Botella 650ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 19.00 WHERE SKU = 'CRISTAL-PACK6';  -- Pack 6 Latas
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 55.00 WHERE SKU = 'CRISTAL-PACK12'; -- Pack 12 Botellas

-- ============================================================================
-- PRODUCTO 6: Agua San Luis Sin Gas (Precio base: S/4)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.00 WHERE SKU = 'SKU-6';      -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.00 WHERE SKU = 'AGUA-625ML'; -- 625ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.00 WHERE SKU = 'AGUA-1L';    -- 1 Litro
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'AGUA-2.5L';  -- 2.5 Litros
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 18.00 WHERE SKU = 'AGUA-20L'; -- Caja 20 Litros

-- ============================================================================
-- PRODUCTO 7: Jugo de Durazno Frugos (Precio base: S/5)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'SKU-7';        -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'FRUGOS-235ML'; -- 235ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6.50 WHERE SKU = 'FRUGOS-1L';    -- 1 Litro
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 8.50 WHERE SKU = 'FRUGOS-1.5L';  -- 1.5 Litros

-- ============================================================================
-- PRODUCTO 8: Arroz Integral (Precio base: S/6)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'SKU-8';          -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'ARROZ-INT-750G'; -- 750g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 32 WHERE SKU = 'ARROZ-INT-5KG'; -- 5 kg

-- ============================================================================
-- PRODUCTO 9: Aguaymanto (Precio base: S/5)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'SKU-9';        -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'AGUAYM-250G';  -- 250g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'AGUAYM-300G';  -- 300g

-- ============================================================================
-- PRODUCTO 10: Tomates Perita (Precio base: S/3)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3 WHERE SKU = 'SKU-10';     -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3 WHERE SKU = 'TOMATE-1KG'; -- 1 kg

-- ============================================================================
-- PRODUCTO 11: Yogurt de Coco Natural (Precio base: S/13)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 13 WHERE SKU = 'SKU-11';        -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 13 WHERE SKU = 'YOG-COCO-500G'; -- 500g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 22 WHERE SKU = 'YOG-COCO-1KG';  -- 1 kg

-- ============================================================================
-- PRODUCTO 12: Couscous (Precio base: S/8)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 8 WHERE SKU = 'SKU-12';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 8 WHERE SKU = 'COUSCOUS-500G'; -- 500g

-- ============================================================================
-- PRODUCTO 13: Lechuga Americana (Precio base: S/3)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3 WHERE SKU = 'SKU-13';      -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3 WHERE SKU = 'LECHUGA-UND'; -- Unidad

-- ============================================================================
-- PRODUCTO 14: Tumbo (Precio base: S/6)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'SKU-14';    -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'TUMBO-1KG'; -- 1 kg

-- ============================================================================
-- PRODUCTO 15: Chirimoya (Precio base: S/10)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'SKU-15';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'CHIRIMOYA-1KG'; -- 1 kg

-- ============================================================================
-- PRODUCTO 16: Chifles Salados (Precio base: S/6)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'SKU-16';      -- Personal
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'CHIFLES-40G'; -- 40g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6.00 WHERE SKU = 'CHIFLES-150G'; -- 150g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7.50 WHERE SKU = 'CHIFLES-200G'; -- 200g

-- ============================================================================
-- PRODUCTO 17: Leche de Avena Barista (Precio base: S/14)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 14 WHERE SKU = 'SKU-17';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 14 WHERE SKU = 'LECHE-AVENA-1L'; -- 1 Litro

-- ============================================================================
-- PRODUCTO 18: Pimientos Rojos (Precio base: S/6)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'SKU-18';       -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'PIMIENTO-UND'; -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'PIMIENTO-2U';  -- 2 unidades
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 8.00 WHERE SKU = 'PIMIENTO-1KG'; -- 1 kg

-- ============================================================================
-- PRODUCTO 19: Brócoli (Precio base: S/2)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'SKU-19';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'BROCOLI-UND';  -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7.00 WHERE SKU = 'BROCOLI-1KG';  -- 1 kg

-- ============================================================================
-- PRODUCTO 20: Muffins de Arándanos (Precio base: S/5)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'SKU-20';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'MUFFIN-UND';   -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 18 WHERE SKU = 'MUFFIN-PACK4'; -- Pack 4

-- ============================================================================
-- PRODUCTO 21: Ricotta Fresca (Precio base: S/10)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'SKU-21';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'RICOTTA-250G'; -- 250g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 35 WHERE SKU = 'RICOTTA-KG';   -- 1 kg granel

-- ============================================================================
-- PRODUCTO 22: Inca Kola (Precio base: S/7)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'SKU-22';      -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'INKA-500ML';  -- 500ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'INKA-1L';     -- 1 Litro
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7.00 WHERE SKU = 'INKA-1.5L';   -- 1.5 Litros
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 9.00 WHERE SKU = 'INKA-2.25L';  -- 2.25 Litros
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 11.00 WHERE SKU = 'INKA-3L';    -- 3 Litros

-- ============================================================================
-- PRODUCTO 23: Zapallo Loche (Precio base: S/7)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'SKU-23';        -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'ZAPALLO-TROZO'; -- Trozo
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12 WHERE SKU = 'ZAPALLO-KG';   -- Entero kg

-- ============================================================================
-- PRODUCTO 24: Pulp Naranja (Precio base: S/7.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1.50 WHERE SKU = 'SKU-24';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1.50 WHERE SKU = 'PULP-150ML';   -- 150ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.00 WHERE SKU = 'PULP-235ML';   -- 235ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 9.00 WHERE SKU = 'PULP-PACK6';   -- Pack 6

-- ============================================================================
-- PRODUCTO 25: Naranjas de Jugo (Precio base: S/3.20)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.20 WHERE SKU = 'SKU-25';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.20 WHERE SKU = 'NARANJA-1KG';  -- 1 kg
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 8.50 WHERE SKU = 'NARANJA-3KG';  -- Malla 3 kg

-- ============================================================================
-- PRODUCTO 26: Crema de Leche Nestlé (Precio base: S/7)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7 WHERE SKU = 'SKU-26';          -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7 WHERE SKU = 'CREMA-LATA-300G'; -- Lata 300g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'CREMA-UHT-200ML'; -- Caja UHT 200ml

-- ============================================================================
-- PRODUCTO 27: Lúcuma Fresca (Precio base: S/7)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12 WHERE SKU = 'SKU-27';      -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12 WHERE SKU = 'LUCUMA-1KG'; -- 1 kg

-- ============================================================================
-- PRODUCTO 28: Yogurt Sabor Durazno Laive (Precio base: S/12.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'SKU-28';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'YOG-DUR-340G'; -- 340g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12.50 WHERE SKU = 'YOG-DUR-946G'; -- 946g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1.80 WHERE SKU = 'YOG-DUR-125G'; -- Vaso 125g

-- ============================================================================
-- PRODUCTO 29: Espinaca Congelada (Precio base: S/4)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7 WHERE SKU = 'SKU-29';            -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7 WHERE SKU = 'ESPINACA-CONG-500G'; -- 500g

-- ============================================================================
-- PRODUCTO 30: Chicha Morada Lista (Precio base: S/5)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'SKU-30';    -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'CHICHA-1L'; -- 1 Litro

-- ============================================================================
-- PRODUCTO 31: Chuleta de Cerdo (Precio base: S/25)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 15 WHERE SKU = 'SKU-31';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 15 WHERE SKU = 'CHULETA-500G'; -- ~500g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 28 WHERE SKU = 'CHULETA-1KG';  -- ~1 kg

-- ============================================================================
-- PRODUCTO 32: Mollejas de Pollo (Precio base: S/13)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 13 WHERE SKU = 'SKU-32';        -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 13 WHERE SKU = 'MOLLEJAS-500G'; -- 500g

-- ============================================================================
-- PRODUCTO 33: Leche Gloria (Precio base: S/6.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6.50 WHERE SKU = 'GLO-ENT-1L';     -- 1L Entera
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7.50 WHERE SKU = 'GLO-SL-1L';      -- 1L Sin Lactosa
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'LECHE-BOL-900ML'; -- Bolsa 900ml
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 35.00 WHERE SKU = 'LECHE-PACK6-1L'; -- Pack 6

-- ============================================================================
-- PRODUCTO 34: Granadilla (Precio base: S/8.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 8.50 WHERE SKU = 'SKU-34';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 8.50 WHERE SKU = 'GRANADILLA-1KG'; -- 1 kg
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 15 WHERE SKU = 'GRANADILLA-2KG';   -- Malla 2 kg

-- ============================================================================
-- PRODUCTO 35: Cebolla Roja (Precio base: S/3)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3 WHERE SKU = 'SKU-35';      -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3 WHERE SKU = 'CEBOLLA-1KG'; -- 1 kg
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'CEBOLLA-2KG'; -- Malla 2 kg

-- ============================================================================
-- PRODUCTO 36: Yogurt Griego (Precio base: S/10)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'YOG-GRE-FRE-500'; -- Fresa 500g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'YOG-GRE-VAI-500'; -- Vainilla 500g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'YOG-GRI-120G';  -- Vaso 120g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 15 WHERE SKU = 'YOG-GRI-800G';    -- Pote 800g

-- ============================================================================
-- PRODUCTO 37: Baguette Artesanal (Precio base: S/4.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'SKU-37';        -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'BAGUETTE-UND';  -- Unidad 250g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'BAGUETTE-MINI'; -- Mini

-- ============================================================================
-- PRODUCTO 38: Pan Centeno Artesanal (Precio base: S/12)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12 WHERE SKU = 'SKU-38';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12 WHERE SKU = 'PAN-CENT-500G';  -- Molde 500g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 18 WHERE SKU = 'PAN-CENT-HOG';   -- Hogaza entera

-- ============================================================================
-- PRODUCTO 39: Queso Vegano Rallado (Precio base: S/20)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 20 WHERE SKU = 'SKU-39';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 20 WHERE SKU = 'QUESO-VEG-200G'; -- 200g

-- ============================================================================
-- PRODUCTO 40: Mini Galletas Ritz (Precio base: S/1.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1.50 WHERE SKU = 'SKU-40';    -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1.50 WHERE SKU = 'RITZ-34G';  -- 34g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 8.00 WHERE SKU = 'RITZ-PACK6'; -- Pack 6

-- ============================================================================
-- PRODUCTO 41: Huevos de Gallina (Precio base: S/10)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'SKU-41';      -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'HUEVOS-6U';   -- 6 unidades
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 11 WHERE SKU = 'HUEVOS-12U'; -- 12 unidades
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 13 WHERE SKU = 'HUEVOS-15U'; -- 15 unidades
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 24 WHERE SKU = 'HUEVOS-30U'; -- 30 unidades

-- ============================================================================
-- PRODUCTO 42: Galletas Soda Field (Precio base: S/1)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1 WHERE SKU = 'SKU-42';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1 WHERE SKU = 'SODA-34G';       -- 34g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'SODA-SIX-222G';  -- Sixpack 222g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 9 WHERE SKU = 'SODA-FAMILIAR';  -- Familiar

-- ============================================================================
-- PRODUCTO 43: Galletas de Agua Costa (Precio base: S/3.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'SKU-43';          -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'GAL-COSTA-TUBO';  -- Tubo
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 18 WHERE SKU = 'GAL-COSTA-PACK6';   -- Pack 6

-- ============================================================================
-- PRODUCTO 44: Yuca Fresca (Precio base: S/3.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'SKU-44';        -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'YUCA-1KG';      -- 1 kg
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'YUCA-CONG-500G'; -- Congelada 500g

-- ============================================================================
-- PRODUCTO 45: Espinaca Fresca (Precio base: S/3)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'SKU-45';           -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3.50 WHERE SKU = 'ESPINACA-ATADO';   -- Atado 500g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'ESPINACA-LAV-200G';   -- Lavada 200g

-- ============================================================================
-- PRODUCTO 46: Quinua Blanca (Precio base: S/18)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'SKU-46';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'QUINUA-250G';  -- 250g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 11 WHERE SKU = 'QUINUA-500G'; -- 500g

-- ============================================================================
-- PRODUCTO 47: Maíz Morado (Precio base: S/1.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'SKU-47';          -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 4.50 WHERE SKU = 'MAIZ-MOR-1KG';    -- 1 kg
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6.50 WHERE SKU = 'MAIZ-MOR-DESG-500G'; -- Desgranado 500g

-- ============================================================================
-- PRODUCTO 48: Arroz Superior Costeño (Precio base: S/23)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'SKU-48';          -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'ARROZ-COST-750G'; -- 750g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 28 WHERE SKU = 'ARROZ-COST-5KG'; -- 5 kg

-- ============================================================================
-- PRODUCTO 49: Filete de Pescado Congelado (Precio base: S/15)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 18 WHERE SKU = 'SKU-49';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 18 WHERE SKU = 'PESCADO-500G'; -- 500g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 34 WHERE SKU = 'PESCADO-1KG';  -- 1 kg

-- ============================================================================
-- PRODUCTO 50: Pecanas Confitadas (Precio base: S/13)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 13 WHERE SKU = 'SKU-50';        -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 13 WHERE SKU = 'PECANAS-100G';  -- 100g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 24 WHERE SKU = 'PECANAS-200G';  -- 200g

-- ============================================================================
-- PRODUCTO 51: Croissant de Mantequilla (Precio base: S/6)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'SKU-51';          -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'CROISSANT-UND';   -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 32 WHERE SKU = 'CROISSANT-CAJA6'; -- Caja 6

-- ============================================================================
-- PRODUCTO 52: Papa Amarilla (Precio base: S/5.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'SKU-52';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'PAPA-AMAR-1KG';  -- 1 kg
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'PAPA-AMAR-2KG';    -- Malla 2 kg

-- ============================================================================
-- PRODUCTO 53: Manzanas Gala (Precio base: S/7.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7.50 WHERE SKU = 'SKU-53';       -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 7.50 WHERE SKU = 'MANZANA-1KG';  -- 1 kg
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10.50 WHERE SKU = 'MANZANA-1.5KG'; -- 1.5 kg

-- ============================================================================
-- PRODUCTO 54: Pierna de Pollo con Encuentro (Precio base: S/12)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 14 WHERE SKU = 'SKU-54';           -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 14 WHERE SKU = 'PIERNA-POLL-1KG';  -- Bandeja ~1 kg
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 14 WHERE SKU = 'PIERNA-POLL-KG';   -- Granel kg

-- ============================================================================
-- PRODUCTO 55: Mix de Frutos Secos (Precio base: S/12)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12 WHERE SKU = 'SKU-55';           -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 12 WHERE SKU = 'MIX-FRUTOS-100G';  -- 100g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 28 WHERE SKU = 'MIX-FRUTOS-250G';  -- 250g

-- ============================================================================
-- PRODUCTO 56: Café Pasión Peruana Molido (Precio base: S/19.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 19.50 WHERE SKU = 'SKU-56';    -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 19.50 WHERE SKU = 'CAFE-250G'; -- 250g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 36 WHERE SKU = 'CAFE-500G';    -- 500g

-- ============================================================================
-- PRODUCTO 57: Carne Molida de Res (Precio base: S/30)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 17 WHERE SKU = 'SKU-57';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 17 WHERE SKU = 'CARNE-MOL-500G'; -- 500g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 32 WHERE SKU = 'CARNE-MOL-1KG';  -- 1 kg

-- ============================================================================
-- PRODUCTO 58: Pan Ciabatta (Precio base: S/0.50)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1.20 WHERE SKU = 'SKU-58';         -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 1.20 WHERE SKU = 'CIABATTA-UND';   -- Unidad
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6 WHERE SKU = 'CIABATTA-BOL6';     -- Bolsa 6
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 11 WHERE SKU = 'CIABATTA-BOL12';   -- Bolsa 12

-- ============================================================================
-- PRODUCTO 59: Tofu Firme (Precio base: S/10)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'SKU-59';      -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 10 WHERE SKU = 'TOFU-349G';   -- 349g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 14 WHERE SKU = 'TOFU-500G';   -- 500g fresco

-- ============================================================================
-- PRODUCTO 60: Papas Lays Original (Precio base: S/6)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'SKU-60';    -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2.50 WHERE SKU = 'LAYS-36G';  -- 36g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5 WHERE SKU = 'LAYS-70G';     -- 70g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 9 WHERE SKU = 'LAYS-160G';    -- 160g

-- ============================================================================
-- PRODUCTO 61: Leche Evaporada Gloria (Precio base: S/22)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3 WHERE SKU = 'SKU-61';            -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 3 WHERE SKU = 'LECHE-EVAP-170G';   -- 170g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 5.50 WHERE SKU = 'LECHE-EVAP-400G'; -- 400g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 30 WHERE SKU = 'LECHE-EVAP-PACK6'; -- Pack 6

-- ============================================================================
-- PRODUCTO 62: Galletas Oreo (Precio base: S/4)
-- ============================================================================
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2 WHERE SKU = 'SKU-62';           -- Referencia
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 2 WHERE SKU = 'OREO-36G';         -- 36g
UPDATE APP_OWNER.VARIANTES_PRODUCTO SET PRECIO_SOBRESCRITO = 6.50 WHERE SKU = 'OREO-TUBO-126G'; -- Tubo 126g

-- ============================================================================
-- COMMIT
-- ============================================================================
COMMIT;

-- ============================================================================
-- VERIFICACIÓN: Consulta para ver los precios actualizados
-- ============================================================================
-- SELECT 
--     p.NOMBRE_ES AS Producto,
--     v.SKU,
--     v.NOMBRE_ES AS Variante,
--     p.PRECIO AS Precio_Base,
--     v.PRECIO_SOBRESCRITO AS Precio_Variante,
--     NVL(v.PRECIO_SOBRESCRITO, p.PRECIO) AS Precio_Efectivo
-- FROM APP_OWNER.PRODUCTOS p
-- JOIN APP_OWNER.VARIANTES_PRODUCTO v ON p.ID = v.PRODUCTO_ID
-- WHERE v.ACTIVO = 'S'
-- ORDER BY p.ID, v.ID;

PROMPT ================================================================
PROMPT Script ejecutado exitosamente.
PROMPT Se actualizaron los precios de todas las variantes de productos.
PROMPT ================================================================
