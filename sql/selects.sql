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



SELECT * FROM "tblUsers" 

SELECT * FROM "tblTelemetryParameterization" 

SELECT * FROM "tblTelemetryData"

SELECT * FROM "tblAlerts" 

SELECT * FROM "tblAlertUser" 

SELECT ttd.value, ttp.label FROM "tblTelemetryData" ttd 
INNER JOIN "tblTelemetryParameterization" ttp ON ttp.id = ttd."telemetryParamId"
ORDER BY "timestamp" DESC
LIMIT 4


SELECT * FROM "tblUsers" tu 
INNER JOIN "tblAlertUser" tau ON tu.id = tau."userId"
INNER JOIN "tblAlerts" ta ON ta.id = tau."alertId"




SELECT
    ta.message,
    ta."timestamp",
    ttd.value,
    ttp."label",
    ttp.append,
    ttp."minValue",
    ttp."maxValue",
    ttp."lowerThreshold",
    ttp."upperThreshold"
FROM "tblAlerts" ta 
INNER JOIN "tblTelemetryData" ttd
    ON ttd.id = ta."telemetryDataId" 
INNER JOIN "tblTelemetryParameterization" ttp 
    ON ttp.id = ttd."telemetryParamId"
ORDER BY "timestamp" DESC 


SELECT * FROM "tblUsers" tu 

SELECT * FROM "tblRoles"