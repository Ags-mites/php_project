CREATE DATABASE IF NOT EXISTS InternationalTrade;
USE InternationalTrade;

CREATE TABLE Categoria (
    id_categoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(255) NOT NULL
);

CREATE TABLE EstadoImportacion (
    id_estado INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL UNIQUE,
    descripcion_estado VARCHAR(255) NOT NULL
);

CREATE TABLE ProveedorInternacional (
    id_proveedor INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(255) NOT NULL,
    pais_origen VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    email_contacto VARCHAR(100) NOT NULL
);

CREATE TABLE Producto (
    id_producto INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT UNSIGNED NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    valor_unitario DECIMAL(18, 2) NOT NULL,
    pais_origen VARCHAR(255) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    CONSTRAINT fk_prod_categoria FOREIGN KEY (id_categoria) 
        REFERENCES Categoria(id_categoria)
);

CREATE TABLE Importacion (
    id_importacion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT UNSIGNED NOT NULL,
    id_estado INT UNSIGNED NOT NULL,
    fecha_inicio DATETIME,
    fecha_estimada DATETIME,
    CONSTRAINT fk_imp_proveedor FOREIGN KEY (id_proveedor) 
        REFERENCES ProveedorInternacional(id_proveedor),
    CONSTRAINT fk_imp_estado FOREIGN KEY (id_estado) 
        REFERENCES EstadoImportacion(id_estado)
);

CREATE TABLE DetalleImportacion (
    id_detalle INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      INT UNSIGNED NOT NULL,
    id_producto INT UNSIGNED NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(18, 2) NOT NULL,
    CONSTRAINT fk_det_importacion FOREIGN KEY (id_importacion) 
        REFERENCES Importacion(id_importacion),
    CONSTRAINT fk_det_producto FOREIGN KEY (id_producto) 
        REFERENCES Producto(id_producto)
);

CREATE TABLE DocumentoAduanero (
    id_documento INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_importacion INT UNSIGNED NOT NULL,
    tipo_documento VARCHAR(50),
    numero_documento VARCHAR(100) NOT NULL,
    fecha_emision DATETIME,
    CONSTRAINT fk_doc_importacion FOREIGN KEY (id_importacion) 
        REFERENCES Importacion(id_importacion)
);

CREATE TABLE Pago (
    id_pago INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_importacion INT UNSIGNED NOT NULL,
    monto DECIMAL(18, 2) NOT NULL,
    metodo_pago VARCHAR(50), 
    moneda VARCHAR(3) DEFAULT 'USD',
    fecha_pago DATE,
    CONSTRAINT fk_pago_importacion FOREIGN KEY (id_importacion) 
        REFERENCES Importacion(id_importacion)
);

CREATE TABLE Transporte (
    id_transporte INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_importacion INT UNSIGNED NOT NULL,
    tipo_transporte VARCHAR(50), 
    empresa_transportista VARCHAR(150),
    numero_guia VARCHAR(100) NOT NULL,
    CONSTRAINT fk_trans_importacion FOREIGN KEY (id_importacion) 
        REFERENCES Importacion(id_importacion)
);
CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_importacion INT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL, 
);

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username INT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL, 
    password  VARCHAR(50) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (id) 
        REFERENCES roles (id)
);


-- Categorías
INSERT INTO Categoria (nombre_categoria) VALUES 
('Electrónica'),
('Ropa'),
('Alimentos'),
('Muebles'),
('Juguetes');
-- Proveedores Internacionales
INSERT INTO ProveedorInternacional (nombre_empresa, pais_origen, direccion, email_contacto) VALUES 
('TechSupply Corp', 'China', 'Shenzhen, Guangdong 518000', 'contacto@techsupply.cn'),
('EuroTextil GmbH', 'Alemania', 'Berlín, Deutschland', 'ventas@eurotextil.de'),
('FreshFoods SA', 'Chile', 'Santiago de Chile', 'export@freshfoods.cl'),
('AsianGoods Ltd', 'Japón', 'Tokyo 100-0001', 'info@asiangoods.jp'),
('AmericanParts Inc', 'Estados Unidos', 'Los Angeles, CA 90001', 'orders@americanparts.us');
-- Productos
INSERT INTO Producto (id_categoria, descripcion, valor_unitario, pais_origen, sku) VALUES 
(1, 'Laptop Dell XPS 15', 1299.99, 'China', 'LAP-DELL-001'),
(1, 'Samsung Galaxy S24', 899.00, 'Corea del Sur', 'MOB-SAM-002'),
(2, 'Camisa Algodón Premium', 45.50, 'Bangladesh', 'CAM-COT-001'),
(2, 'Jeans Slim Fit', 65.00, 'Turquía', 'JEAN-SLM-001'),
(3, 'Café Orgánico Premium', 12.50, 'Colombia', 'CAF-ORG-001'),
(3, 'Aceite de Oliva Extra', 18.75, 'España', 'ACE-OLV-001'),
(4, 'Sillón Ejecutivo', 350.00, 'Italia', 'SIL-EJE-001'),
(4, 'Mesa de Centro Moderna', 180.00, 'Brasil', 'MES-CEN-001'),
(5, ' Lego City Set', 49.99, 'Dinamarca', 'LEG-CIT-001'),
(5, 'Muñeca Barbie Dreamhouse', 79.99, 'Estados Unidos', 'BAR-DRH-001');
-- Estados de Importación
INSERT INTO EstadoImportacion (nombre_estado, descripcion_estado) VALUES 
('Pendiente', 'Importación registrada, esperando confirmación'),
('En Proceso', 'Importación en tránsito'),
('En Aduana', 'Documentos en revisión aduanera'),
('Completada', 'Importación entregada'),
('Cancelada', 'Importación cancelada');
-- Importaciones
INSERT INTO Importacion (id_proveedor, id_estado, fecha_inicio, fecha_estimada) VALUES 
(1, 2, '2026-01-15', '2026-02-28'),
(2, 3, '2026-01-20', '2026-03-05'),
(3, 1, '2026-02-01', '2026-03-15'),
(4, 4, '2026-01-10', '2026-02-20'),
(5, 2, '2026-02-10', '2026-03-25');
-- Detalles de Importación
INSERT INTO DetalleImportacion (id_importacion, id_producto, cantidad, precio_unitario) VALUES 
(1, 1, 50, 1299.99),
(1, 2, 100, 899.00),
(2, 3, 200, 45.50),
(2, 4, 150, 65.00),
(3, 5, 500, 12.50),
(3, 6, 300, 18.75),
(4, 7, 20, 350.00),
(4, 8, 30, 180.00),
(5, 9, 100, 49.99),
(5, 10, 80, 79.99);
-- Documentos Aduaneros
INSERT INTO DocumentoAduanero (id_importacion, tipo_documento, numero_documento, fecha_emision) VALUES 
(1, 'Factura Comercial', 'FAC-2026-001', '2026-01-16'),
(1, 'Bill of Lading', 'BL-2026-001', '2026-01-17'),
(2, 'Factura Comercial', 'FAC-2026-002', '2026-01-21'),
(2, 'Certificado de Origen', 'CDO-2026-001', '2026-01-22'),
(3, 'Factura Comercial', 'FAC-2026-003', '2026-02-02'),
(4, 'Factura Comercial', 'FAC-2026-004', '2026-01-11'),
(4, 'Bill of Lading', 'BL-2026-002', '2026-01-12'),
(5, 'Factura Comercial', 'FAC-2026-005', '2026-02-11');
-- Pagos
INSERT INTO Pago (id_importacion, monto, metodo_pago, moneda, fecha_pago) VALUES 
(1, 64999.50, 'Transferencia', 'USD', '2026-01-18'),
(1, 45000.00, 'Carta de Crédito', 'USD', '2026-02-01'),
(2, 9100.00, 'PayPal', 'USD', '2026-01-25'),
(3, 6250.00, 'Transferencia', 'USD', '2026-02-05'),
(4, 10400.00, 'Carta de Crédito', 'USD', '2026-01-15'),
(5, 11197.50, 'Transferencia', 'USD', '2026-02-15');
-- Transportes
INSERT INTO Transporte (id_importacion, tipo_transporte, empresa_transportista, numero_guia) VALUES 
(1, 'Marítimo', 'Maersk Line', 'MAEU1234567'),
(1, 'Terrestre', 'DHL Logistics', 'DHL-2026-001'),
(2, 'Aéreo', 'FedEx Express', 'FX-2026-12345'),
(3, 'Marítimo', 'MSC Shipping', 'MSC-2026-54321'),
(4, 'Terrestre', 'UPS Freight', 'UPS-2026-98765'),
(5, 'Aéreo', 'Lufthansa Cargo', 'LH-2026-CARGO01');

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'Admin123;
CREATE USER IF NOT EXISTS 'dev'@'localhost'   IDENTIFIED BY Dev123;
CREATE USER IF NOT EXISTS 'supervisor@'localhost'  IDENTIFIED BY 'Sup123';

GRANT ALL PRIVILEGES ON InternationalTrade.* TO 'admin'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE
ON InternationalTrade.* TO 'dev'@'localhost';

GRANT SELECT
ON InternationalTrade.* TO 'supervisor'@'localhost';

FLUSH PRIVILEGES;
