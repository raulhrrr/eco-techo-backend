import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TelemetryDataModel } from '../interfaces/telemetry-data';
import { TelemetryData } from '../entities/telemetry-data';
import { InjectModel } from '@nestjs/sequelize';
import { TelemetryProcessResponse } from '../interfaces/telemetry-process-response';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectModel(TelemetryData)
    private readonly telemetryDataModel: typeof TelemetryData,
  ) {}

  async process(data: TelemetryDataModel): Promise<TelemetryProcessResponse> {
    try {
      const newTelemtricData = await this.telemetryDataModel.create(data);
      return {
        id: newTelemtricData.id,
        message: 'Data saved successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Something terrible happened!!!');
    }
  }
}
