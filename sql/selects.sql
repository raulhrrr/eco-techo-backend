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




SELECT min("timestamp"), max("timestamp") FROM "tblTelemetryData"


INSERT INTO "tblTelemetryData" (id, temperature, humidity, pressure, gas_resistance, "timestamp")
SELECT id, temperature, humidity, pressure, gas_resistance, "timestamp" FROM "tblTelemetryData1" 
