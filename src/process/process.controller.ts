import { Body, Controller, Post } from '@nestjs/common';
import { ProcessService } from './services/process.service';
import { TelemetricDataModel } from './interfaces/telemetric-data';
import { ProcessResponse } from './interfaces/process-response';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post('catch-data')
  async process(@Body() data: TelemetricDataModel): Promise<ProcessResponse> {
    return await this.processService.process(data);
  }
}
