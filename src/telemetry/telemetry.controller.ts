import { Body, Controller, Post } from '@nestjs/common';
import { TelemetryService } from './services/telemetry.service';
import { TelemetryDataModel } from './interfaces/telemetry-data';
import { TelemetryProcessResponse } from './interfaces/telemetry-process-response';
import { TelemetryGateway } from './telemetry.gateway';

@Controller('telemetry')
export class TelemetryController {
  constructor(
    private readonly telemetryService: TelemetryService,
    private readonly telemetryGateway: TelemetryGateway
  ) { }

  @Post('catch-data')
  async process(@Body() data: TelemetryDataModel): Promise<TelemetryProcessResponse> {
    this.telemetryGateway.emitTelemetryData(data);
    return await this.telemetryService.process(data);
  }
}
