import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TelemetryService } from './services/telemetry.service';
import { TelemetryDataFiltered, TelemetryDataModel } from './interfaces/telemetry-data';
import { TelemetryProcessResponse } from './interfaces/telemetry-process-response';
import { TelemetryGateway } from './telemetry.gateway';
import { TelemetryParameterization } from './entities';

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

  @Get('filtered-data')
  async getTelemetryData(
    @Query('initDate') initDate: string,
    @Query('endDate') endDate: string,
    @Query('groupBy') groupBy: 'day' | 'hour',
  ): Promise<TelemetryDataFiltered[]> {
    return await this.telemetryService.getTelemetryByRange(initDate, endDate, groupBy);
  }

  @Get('parameterization')
  async getParameterization(): Promise<TelemetryParameterization[]> {
    return await this.telemetryService.getParameterization();
  }
}
