/* INSERTS */
INSERT INTO
    "tblTelemetryParameterization" (
        "label",
        "initialValue",
        "append",
        "minValue",
        "maxValue",
        "lowerThreshold",
        "upperThreshold"
    )
VALUES
    ('Temperatura', 0, '°C', 0, 50, 5, 45),
    ('Humedad', 0, '%', 0, 100, 10, 90),
    ('Presión', 0, 'hPa', 0, 1000, 250, 950),
    ('Resistencia al gas', 0, 'kΩ', 0, 100, 20, 80);

INSERT INTO
    "tblUsers" (
        email,
        "name",
        "password",
        "isActive",
        "createdAt",
        "updatedAt"
    )
VALUES(
    'user@mail.com',
    'User',
    '',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);