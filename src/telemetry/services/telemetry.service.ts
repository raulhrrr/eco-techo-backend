import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TelemetryDataFiltered, TelemetryDataModel } from '../interfaces/telemetry-data';
import { Alert, AlertUser, TelemetryData, TelemetryParameterization } from '../entities';
import { InjectModel } from '@nestjs/sequelize';
import { TelemetryProcessResponse } from '../interfaces/telemetry-process-response';
import { Op, Sequelize } from 'sequelize';
import { Role, User } from '../../auth/entities';
import { ALERT_ROLE, GAS_RESISTANCE, HUMIDITY, PRESSURE, TEMPERATURE } from '../../constants';
import { sendEmail } from '../../shared/helpers/mail';
import { UpdateTelemetryParameterizationDto } from '../dto/update-telemetry-parameterization.dto';

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
      { telemetryParamId: this.telemetryParams.find(p => p.label === TEMPERATURE).id, value: data.temperature },
      { telemetryParamId: this.telemetryParams.find(p => p.label === HUMIDITY).id, value: data.humidity },
      { telemetryParamId: this.telemetryParams.find(p => p.label === PRESSURE).id, value: data.pressure },
      { telemetryParamId: this.telemetryParams.find(p => p.label === GAS_RESISTANCE).id, value: data.gas_resistance },
    ];
  }

  private async sendEmailNotification(activeUsers: User[], alerts: Alert[]) {
    const emails = activeUsers.map(user => user.email);
    const message = alerts.map(alert => alert.message).join('\n');
    await sendEmail(emails, 'Alerta de Telemetría Eco-Techo', message);
  }

  private async generateAlerts(telemetryData: TelemetryData[]) {
    const newAlerts = [];

    for (const data of telemetryData) {
      const param = this.telemetryParams.find(p => p.id === data.telemetryParamId);

      if (!param) continue;

      if (!param.isAlertEnabled) continue;

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

    if (newAlerts.length === 0) return;

    const storedAlerts = await this.alertModel.bulkCreate(newAlerts);
    const activeUsers = await this.userModel.findAll({
      where: { isActive: true },
      include: [{
        model: Role,
        where: { name: ALERT_ROLE },
      }]
    });
    const alertUsers = activeUsers.map(user => {
      return storedAlerts.map(alert => {
        return { userId: user.id, alertId: alert.id };
      });
    }).flat();

    if (alertUsers.length > 0) {
      await this.alertUserModel.bulkCreate(alertUsers);
      await this.sendEmailNotification(activeUsers, storedAlerts);
    }
  }

  async process(data: TelemetryDataModel): Promise<TelemetryProcessResponse> {
    try {
      await this.getParameterization();
      const telemetryRecords = this.generateTelemetryRecords(data);
      const storedTelemetryData = await this.telemetryDataModel.bulkCreate(telemetryRecords);

      await this.generateAlerts(storedTelemetryData);

      return { statusCode: 200, message: 'Datos almacenados correctamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error inesperado');
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
          case TEMPERATURE:
            currentData.avg_temperature = avgValue;
            break;
          case HUMIDITY:
            currentData.avg_humidity = avgValue;
            break;
          case PRESSURE:
            currentData.avg_pressure = avgValue;
            break;
          case GAS_RESISTANCE:
            currentData.avg_gas_resistance = avgValue;
            break;
        }
      });

      return Array.from(resultMap.values());
    } catch (error) {
      throw new InternalServerErrorException('Error obteniendo los datos de telemetría');
    }
  }

  async getParameterization(): Promise<TelemetryParameterization[]> {
    try {
      this.telemetryParams = await this.telemetryParameterizationModel.findAll();
      return this.telemetryParams;
    } catch (error) {
      throw new InternalServerErrorException('Error obteniendo los datos de parametrización');
    }
  }

  async updateParameterization(parameterization: UpdateTelemetryParameterizationDto): Promise<TelemetryProcessResponse> {
    try {
      const updatedParam = await this.telemetryParameterizationModel.update(parameterization, {
        where: { id: parameterization.id }
      });

      if (updatedParam[0] === 0) {
        throw new InternalServerErrorException('Parámetro no encontrado');
      }

      return { statusCode: 200, message: `El parámetro ${parameterization.label.toLowerCase()} se ha actualizado correctamente` };
    } catch (error) {
      throw new InternalServerErrorException(`Error actualizando el parámetro ${parameterization.label.toLowerCase()}`);
    }
  }

  async getAlerts(initDate: string, endDate: string): Promise<Alert[]> {
    try {
      const alerts = await this.alertModel.findAll({
        where: {
          timestamp: {
            [Op.between]: [`${initDate} 00:00:00.000 -05:00`, `${endDate} 23:59:59.999 -05:00`],
          },
        },
        include: [
          {
            model: this.telemetryDataModel,
            include: [this.telemetryParameterizationModel],
          },
        ],
      });

      return alerts;
    } catch (error) {
      throw new InternalServerErrorException('Error obteniendo los datos de alertas');
    }
  }
}
