import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TelemetricDataModel } from '../interfaces/telemetric-data';
import { TelemetricData } from '../entities/telemetric-data.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ProcessResponse } from '../interfaces/process-response';

@Injectable()
export class ProcessService {
  constructor(
    @InjectModel(TelemetricData)
    private readonly telemetricDataModel: typeof TelemetricData,
  ) {}

  async process(data: TelemetricDataModel): Promise<ProcessResponse> {
    try {
      const newTelemtricData = await this.telemetricDataModel.create(data);
      return {
        id: newTelemtricData.id,
        message: 'Data saved successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Something terrible happened!!!');
    }
  }
}
