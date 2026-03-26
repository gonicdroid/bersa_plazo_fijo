CREATE DATABASE IF NOT EXISTS BERSA;
USE BERSA;
CREATE TABLE monedas (
    idMoneda INTEGER PRIMARY KEY AUTO_INCREMENT,
    tipoMoneda VARCHAR(3) NOT NULL UNIQUE
);

CREATE TABLE cuentas (
    idCuenta INTEGER PRIMARY KEY AUTO_INCREMENT,
    numeroCuenta VARCHAR(25) NOT NULL UNIQUE,
    idMoneda INTEGER NOT NULL,
    FOREIGN KEY (idMoneda) REFERENCES monedas(idMoneda)
);

CREATE TABLE estadosPlazoFijo (
    idEstado INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombreEstado VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE plazosFijos (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    idCuenta INTEGER NOT NULL,
    monto DECIMAL(18, 2) NOT NULL,
    tasaAnual DECIMAL(5, 2) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaVencimiento DATE NOT NULL,
--    interesCalculado DECIMAL(18, 2) NOT NULL,
--    montoFinal DECIMAL(18, 2) NOT NULL,
    idEstado INTEGER NOT NULL,
    FOREIGN KEY (idEstado) REFERENCES estadosPlazoFijo(idEstado),
    FOREIGN KEY (idCuenta) REFERENCES cuentas(idCuenta)
);

INSERT INTO monedas (tipoMoneda) VALUES ('ARS'), ('USD');
INSERT INTO estadosPlazoFijo (nombreEstado) VALUES ('ACTIVO'), ('VENCIDO'), ('CANCELADO'), ('RENOVADO');
