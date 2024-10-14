/* DROPS */
DROP TABLE IF EXISTS "tblUsers";
DROP TABLE IF EXISTS "tblTelemetryData";
DROP TABLE IF EXISTS "tblTelemetryParameterization";

/* TRUNCATES */
TRUNCATE TABLE "tblUsers1";
TRUNCATE TABLE "tblTelemetryData";
TRUNCATE TABLE "tblTelemetryParameterization";

/* CREATES */
CREATE TABLE "tblUsers" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL
);

CREATE TABLE "tblTelemetryData" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "temperature" FLOAT NOT NULL,
    "humidity" FLOAT NOT NULL,
    "pressure" FLOAT NOT NULL,
    "gasResistance" FLOAT NOT NULL,
    "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tblTelemetryParameterization" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "label" VARCHAR(50) UNIQUE NOT NULL,
    "initialValue" FLOAT NOT NULL,
    "append" VARCHAR(10) NOT NULL,
    "minValue" FLOAT NOT NULL,
    "maxValue" FLOAT NOT NULL,
    "alertThreshold" FLOAT NOT NULL
);

CREATE TABLE "tblAlerts" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "alertValue" FLOAT NOT NULL,
    "userId" UUID NOT NULL REFERENCES "tblUsers"("id"),
    "alertTypeId" UUID NOT NULL REFERENCES "tblAlertTypes"("id"),
    -- "telemetryDataId" UUID NOT NULL REFERENCES "tblTelemetryData"("id"),
    "telemetryParamId" UUID NOT NULL REFERENCES "tblTelemetryParameterization"("id"),
    "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tblAlertTypes" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "alert_type" VARCHAR(100) NOT NULL
);


INSERT INTO 
    "tblTelemetryParameterization" ("label", "initialValue", append, "minValue", "maxValue", "alertThreshold") 
VALUES
    ('Temperatura', 0, '°C', 0, 50, 45), 
    ('Humedad', 0, '%', 0, 100, 90), 
    ('Presión', 0, 'hPa', 0, 1000, 950),
    ('Resistencia al gas', 0, 'kΩ', 0, 100, 80);

INSERT INTO 
    "tblAlertTypes" (alert_type) 
VALUES
    ('Umbral de temperatura alcanzado'),
    ('Umbral de humedad alcanzado'),
    ('Umbral de presión alcanzado'),
    ('Umbral de resistencia al gas alcanzado');
