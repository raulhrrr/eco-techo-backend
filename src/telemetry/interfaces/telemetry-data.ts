import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class TelemetryDataModel {
  @IsNumber()
  @ApiProperty({ description: "Temperatura medida" })
  temperature: number;
  
  @IsNumber()
  @ApiProperty({ description: "Humedad medida" })
  humidity: number;
  
  @IsNumber()
  @ApiProperty({ description: "Presión medida" })
  pressure: number;
  
  @IsNumber()
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
