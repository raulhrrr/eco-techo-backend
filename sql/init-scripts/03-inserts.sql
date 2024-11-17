/* INSERTS */
INSERT INTO
    "tblTelemetryParameterization" (
        "label",
        "initialValue",
        "append",
        "minValue",
        "maxValue",
        "lowerThreshold",
        "upperThreshold",
        "isAlertEnabled"
    )
VALUES
    ('Temperatura', 0, '°C', 0, 50, 5, 45, FALSE),
    ('Humedad', 0, '%', 0, 100, 10, 90, FALSE),
    ('Presión', 0, 'hPa', 0, 1000, 250, 950, FALSE),
    ('Resistencia al gas', 0, 'kΩ', 0, 100, 20, 80, FALSE);

-- INSERT INTO
--     "tblUsers" (
--         email,
--         "name",
--         "password",
--         "isActive",
--         "createdAt",
--         "updatedAt"
--     )
-- VALUES(
--     'user@mail.com',
--     'User',
--     '',
--     TRUE,
--     CURRENT_TIMESTAMP,
--     CURRENT_TIMESTAMP
-- );

INSERT INTO
    "tblRoles" (
        id,
        "name"
    )
VALUES
    (1, 'Alerta'),
    (2, 'Administrador');