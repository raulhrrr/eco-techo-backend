/* DROPS */
DROP TABLE IF EXISTS "tblAlertUser";

DROP TABLE IF EXISTS "tblAlerts";

DROP TABLE IF EXISTS "tblTelemetryData";

DROP TABLE IF EXISTS "tblTelemetryParameterization";

DROP TABLE IF EXISTS "tblUsers";

/* TRUNCATES */
DELETE FROM "tblAlertUser"

DELETE FROM "tblAlerts" 

DELETE FROM "tblTelemetryData" 

TRUNCATE TABLE "tblTelemetryParameterization";

TRUNCATE TABLE "tblUsers";

/* CREATES */
CREATE TABLE "tblUsers" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "tblTelemetryParameterization" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "label" VARCHAR(50) UNIQUE NOT NULL,
    "initialValue" FLOAT NOT NULL,
    "append" VARCHAR(10) NOT NULL,
    "minValue" FLOAT NOT NULL CHECK ("minValue" < "maxValue"),
    "maxValue" FLOAT NOT NULL,
    "lowerThreshold" FLOAT NOT NULL CHECK ("lowerThreshold" BETWEEN "minValue" AND "maxValue"),
    "upperThreshold" FLOAT NOT NULL CHECK ("upperThreshold" BETWEEN "minValue" AND "maxValue")
);

CREATE TABLE "tblTelemetryData" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "telemetryParamId" UUID REFERENCES "tblTelemetryParameterization"("id"),
    "value" FLOAT NOT NULL,
    "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tblAlerts" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "message" VARCHAR(100) NOT NULL,
    "telemetryDataId" UUID NOT NULL REFERENCES "tblTelemetryData"("id"),
    "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "tblAlertUser" (
    "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    "alertId" UUID NOT NULL REFERENCES "tblAlerts"("id"),
    "userId" UUID NOT NULL REFERENCES "tblUsers"("id"),
    "timestamp" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


SELECT * FROM "tblUsers" 

SELECT * FROM "tblTelemetryParameterization" 

SELECT * FROM "tblTelemetryData"

SELECT * FROM "tblAlerts" 

SELECT * FROM "tblAlertUser" 
