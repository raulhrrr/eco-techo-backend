import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TelemetryDataFiltered, TelemetryDataModel } from '../interfaces/telemetry-data';
import { TelemetryData } from '../entities/telemetry-data';
import { InjectModel } from '@nestjs/sequelize';
import { TelemetryProcessResponse } from '../interfaces/telemetry-process-response';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectModel(TelemetryData)
    private readonly telemetryDataModel: typeof TelemetryData,
  ) { }

  async process(data: TelemetryDataModel): Promise<TelemetryProcessResponse> {
    try {
      const createdAt = new Date().toISOString().split('T')[0];
      const newModel = { ...data, createdAt };
      const newTelemtricData = await this.telemetryDataModel.create(newModel);
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
  ): Promise<TelemetryDataFiltered[]> {
    try {
      let datePart = Sequelize.literal(`CAST(DATE_TRUNC('${groupBy}', "timestamp") AS VARCHAR)`);

      const telemetryData = await this.telemetryDataModel.findAll({
        attributes: [
          [datePart, 'groupedDate'],
          [Sequelize.fn('AVG', Sequelize.col('temperature')), 'avg_temperature'],
          [Sequelize.fn('AVG', Sequelize.col('humidity')), 'avg_humidity'],
          [Sequelize.fn('AVG', Sequelize.col('pressure')), 'avg_pressure'],
          [Sequelize.fn('AVG', Sequelize.col('gas_resistance')), 'avg_gas_resistance'],
        ],
        where: {
          createdAt: {
            [Op.between]: [initDate, endDate]
          },
        },
        group: ['groupedDate'],
        order: [[Sequelize.col('groupedDate'), 'ASC']],
      });

      return telemetryData.map(data => ({
        groupedDate: String(data.get('groupedDate')),
        avg_temperature: Number(data.get('avg_temperature')),
        avg_humidity: Number(data.get('avg_humidity')),
        avg_pressure: Number(data.get('avg_pressure')),
        avg_gas_resistance: Number(data.get('avg_gas_resistance')),
      }));
    } catch (error) {
      throw new InternalServerErrorException('Error fetching telemetry data');
    }
  }
}
