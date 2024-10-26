import { PartialType } from '@nestjs/mapped-types';
import { TelemetryParameterizationDto } from './telemetry-parameterization.dto';

export class UpdateTelemetryParameterizationDto extends PartialType(TelemetryParameterizationDto) {}