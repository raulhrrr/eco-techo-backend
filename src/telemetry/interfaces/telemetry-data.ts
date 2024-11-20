import { ApiProperty } from "@nestjs/swagger";

export class TelemetryDataModel {
  @ApiProperty({ description: "Temperatura medida" })
  temperature: number;

  @ApiProperty({ description: "Humedad medida" })
  humidity: number;

  @ApiProperty({ description: "Presión medida" })
  pressure: number;

  @ApiProperty({ description: "Resistencia de gas medida" })
  gas_resistance: number;
}

export interface TelemetryDataFiltered {
  groupedDate: string;
  avg_temperature: number;
  avg_humidity: number;
  avg_pressure: number;
  avg_gas_resistance: number;
}
