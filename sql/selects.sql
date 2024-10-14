SELECT * FROM "tblTelemetryData"

SELECT DISTINCT date("timestamp") FROM "tblTelemetryData" ORDER BY date("timestamp")

SELECT DISTINCT DATE_TRUNC('day', "timestamp") FROM "tblTelemetryData" ORDER BY DATE_TRUNC('day', "timestamp")

-- Promedios por día
SELECT
    DATE_TRUNC('day', "timestamp") AS "groupedDate",
    AVG("temperature") AS "avg_temperature",
    AVG("humidity") AS "avg_humidity",
    AVG("pressure") AS "avg_pressure",
    AVG("gas_resistance") AS "avg_gas_resistance"
FROM
    "tblTelemetryData" AS "TelemetryData"
WHERE
    "TelemetryData"."timestamp" BETWEEN '2024-10-02 00:00:00.000 +00:00' AND '2024-10-06 23:59:59.999 +00:00'
GROUP BY
    "groupedDate"
ORDER BY
    "groupedDate" ASC;

-- Promedios por hora
SELECT
    DATE_TRUNC('hour', "timestamp") AS "groupedDate",
    AVG("temperature") AS "avg_temperature",
    AVG("humidity") AS "avg_humidity",
    AVG("pressure") AS "avg_pressure",
    AVG("gas_resistance") AS "avg_gas_resistance"
FROM
    "tblTelemetryData" AS "TelemetryData"
WHERE
    "TelemetryData"."timestamp" BETWEEN '2024-10-13 00:00:00.000 -0500' AND '2024-10-13 23:59:59.999 -0500'
GROUP BY
    "groupedDate"
ORDER BY
    "groupedDate" ASC;

-- Promedios por rangos personalizados
SELECT 
  DATE_TRUNC('minute', "timestamp") + INTERVAL '30 minute' * FLOOR(EXTRACT(MINUTE FROM "timestamp") / 30) AS interval,
  AVG("temperature") AS avg_temperature,
  AVG("humidity") AS avg_humidity,
  AVG("pressure") AS avg_pressure,
  AVG("gas_resistance") AS avg_gas_resistance
FROM "tblTelemetryData"
WHERE "timestamp" BETWEEN '2024-10-06 00:00:00.000 +00:00' AND '2024-10-06 23:59:59.999 +00:00'
GROUP BY interval
ORDER BY interval;


SELECT * FROM "tblTelemetryData" ttd INNER JOIN "tblTelemetryParameterization" ttp ON ttp.id = ttd."telemetryParamId" 

SELECT
    CAST(DATE_TRUNC('hour', "timestamp") AS VARCHAR) AS "groupedDate",
    AVG("value") AS "avg_value",
    "telemetryParamId"
FROM
    "tblTelemetryData" AS "TelemetryData"
WHERE
    "TelemetryData"."timestamp" BETWEEN '2024-10-14 00:00:00.000 -05:00' AND '2024-10-14 23:59:59.999 -05:00'
    AND "TelemetryData"."telemetryParamId" IN (
        'd90331fb-e23e-4625-9c98-c218e440a637', 'de1fb07c-2f60-4985-8bb6-f6d14be4f2f9', '37e918a9-bd4a-4589-8bd4-cf03df43dab3', 'd038fbd0-20f2-4c9e-a741-708b88c99584'
    )
GROUP BY
    "groupedDate",
    "telemetryParamId"
ORDER BY
    "groupedDate" ASC;
    

SELECT * FROM "tblAlertTypes" tat 

SELECT * FROM "tblTelemetryParameterization" ttp 