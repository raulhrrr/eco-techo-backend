import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TelemetryDataFiltered, TelemetryDataModel } from '../interfaces/telemetry-data';
import { Alert, AlertUser, TelemetryData, TelemetryParameterization } from '../entities';
import { InjectModel } from '@nestjs/sequelize';
import { TelemetryProcessResponse } from '../interfaces/telemetry-process-response';
import { Op, Sequelize } from 'sequelize';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Alert) private readonly alertModel: typeof Alert,
    @InjectModel(AlertUser) private readonly alertUserModel: typeof AlertUser,
    @InjectModel(TelemetryData) private readonly telemetryDataModel: typeof TelemetryData,
    @InjectModel(TelemetryParameterization) private readonly telemetryParameterizationModel: typeof TelemetryParameterization,
  ) { }

  telemetryParams: TelemetryParameterization[];

  private generateTelemetryRecords(data: TelemetryDataModel) {
    return [
      { telemetryParamId: this.telemetryParams.find(p => p.label === 'Temperatura').id, value: data.temperature },
      { telemetryParamId: this.telemetryParams.find(p => p.label === 'Humedad').id, value: data.humidity },
      { telemetryParamId: this.telemetryParams.find(p => p.label === 'Presión').id, value: data.pressure },
      { telemetryParamId: this.telemetryParams.find(p => p.label === 'Resistencia al gas').id, value: data.gas_resistance },
    ];
  }

  private async generateAlerts(telemetryData: TelemetryData[]) {
    const newAlerts = [];
    let storedAlerts: Alert[] = [];

    const activeUsers = await this.userModel.findAll({ where: { isActive: true } });

    for (const data of telemetryData) {
      const param = this.telemetryParams.find(p => p.id === data.telemetryParamId);

      if (!param) continue;

      if (data.value > param.upperThreshold) {
        newAlerts.push({
          telemetryDataId: data.id,
          message: `${param.label} superó el umbral superior (${param.upperThreshold}) con un valor de ${data.value}`,
        });
      } else if (data.value < param.lowerThreshold) {
        newAlerts.push({
          telemetryDataId: data.id,
          message: `${param.label} cayó por debajo del umbral inferior (${param.lowerThreshold}) con un valor de ${data.value}`,
        });
      }
    }

    if (newAlerts.length > 0) {
      storedAlerts = await this.alertModel.bulkCreate(newAlerts);
    }

    const alertUsers = activeUsers.map(user => {
      return storedAlerts.map(alert => {
        return { userId: user.id, alertId: alert.id };
      });
    }).flat();

    if (alertUsers.length > 0) {
      await this.alertUserModel.bulkCreate(alertUsers);
    }
  }

  async process(data: TelemetryDataModel): Promise<TelemetryProcessResponse> {
    try {
      await this.getParameterization();
      const telemetryRecords = this.generateTelemetryRecords(data);
      const storedTelemetryData = await this.telemetryDataModel.bulkCreate(telemetryRecords);

      await this.generateAlerts(storedTelemetryData);

      return { message: 'Data saved successfully' };
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
      const datePart = Sequelize.literal(`CAST(DATE_TRUNC('${groupBy}', "timestamp") AS VARCHAR)`);

      this.getParameterization();

      const paramIds = this.telemetryParams.map(param => param.id);

      const telemetryData = await this.telemetryDataModel.findAll({
        attributes: [
          [datePart, 'groupedDate'],
          [Sequelize.fn('AVG', Sequelize.col('value')), 'avg_value'],
          'telemetryParamId',
        ],
        where: {
          timestamp: {
            [Op.between]: [`${initDate} 00:00:00.000 -05:00`, `${endDate} 23:59:59.999 -05:00`],
          },
          telemetryParamId: {
            [Op.in]: paramIds,
          },
        },
        group: ['groupedDate', 'telemetryParamId'],
        order: [[Sequelize.col('groupedDate'), 'ASC']],
      });

      const resultMap = new Map<string, TelemetryDataFiltered>();

      telemetryData.forEach(data => {
        const groupedDate = String(data.get('groupedDate'));
        const avgValue = Number(data.get('avg_value'));
        const paramId = data.get('telemetryParamId');
        const label = this.telemetryParams.find(param => param.id === paramId).label;

        if (!resultMap.has(groupedDate)) {
          resultMap.set(groupedDate, {
            groupedDate,
            avg_temperature: 0,
            avg_humidity: 0,
            avg_pressure: 0,
            avg_gas_resistance: 0,
          });
        }

        const currentData = resultMap.get(groupedDate);

        switch (label) {
          case 'Temperatura':
            currentData.avg_temperature = avgValue;
            break;
          case 'Humedad':
            currentData.avg_humidity = avgValue;
            break;
          case 'Presión':
            currentData.avg_pressure = avgValue;
            break;
          case 'Resistencia al gas':
            currentData.avg_gas_resistance = avgValue;
            break;
        }
      });

      return Array.from(resultMap.values());
    } catch (error) {
      throw new InternalServerErrorException('Error fetching telemetry data');
    }
  }

  async getParameterization(): Promise<TelemetryParameterization[]> {
    try {
      if (!this.telemetryParams) {
        this.telemetryParams = await this.telemetryParameterizationModel.findAll();
      }
      return this.telemetryParams;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching telemetry parameterization');
    }
  }
}
