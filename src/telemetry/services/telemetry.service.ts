import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TelemetryDataModel } from '../interfaces/telemetry-data';
import { TelemetryData } from '../entities/telemetry-data';
import { InjectModel } from '@nestjs/sequelize';
import { TelemetryProcessResponse } from '../interfaces/telemetry-process-response';
import { Op, Sequelize } from 'sequelize';
import { Fn } from 'sequelize/types/utils';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectModel(TelemetryData)
    private readonly telemetryDataModel: typeof TelemetryData,
  ) { }

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

  async getTelemetryByRange(
    initDate: string,
    endDate: string,
    groupBy: 'day' | 'hour'
  ): Promise<TelemetryData[]> {
    try {
      let datePart: Fn;

      if (groupBy === 'day') {
        datePart = Sequelize.fn('DATE_TRUNC', 'day', Sequelize.col('timestamp'));
      } else if (groupBy === 'hour') {
        datePart = Sequelize.fn('DATE_TRUNC', 'hour', Sequelize.col('timestamp'));
      }

      const fromDate = new Date(initDate);
      fromDate.setUTCHours(0, 0, 0, 0);

      const toDate = new Date(endDate);
      toDate.setUTCHours(23, 59, 59, 999);

      const telemetryData = await this.telemetryDataModel.findAll({
        attributes: [
          [datePart, 'groupedDate'],
          [Sequelize.fn('AVG', Sequelize.col('temperature')), 'avg_temperature'],
          [Sequelize.fn('AVG', Sequelize.col('humidity')), 'avg_humidity'],
          [Sequelize.fn('AVG', Sequelize.col('pressure')), 'avg_pressure'],
          [Sequelize.fn('AVG', Sequelize.col('gas_resistance')), 'avg_gas_resistance'],
        ],
        where: {
          timestamp: {
            [Op.between]: [fromDate, toDate]
          },
        },
        group: ['groupedDate'],
        order: [[Sequelize.col('groupedDate'), 'ASC']],
      });

      return telemetryData;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching telemetry data');
    }
  }
}
