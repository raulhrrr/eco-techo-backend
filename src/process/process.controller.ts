import { Body, Controller, Post } from '@nestjs/common';
import { ProcessService } from './services/process.service';
import { TelemetricDataModel } from './interfaces/telemetric-data';
import { ProcessResponse } from './interfaces/process-response';
import { ProcessGateway } from './process.gateway';

@Controller('process')
export class ProcessController {
  constructor(
    private readonly processService: ProcessService,
    private readonly processGateway: ProcessGateway
  ) { }

  @Post('catch-data')
  async process(@Body() data: TelemetricDataModel): Promise<ProcessResponse> {
    this.processGateway.sendTelemetricData(data);
    return await this.processService.process(data);
  }
}
