import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { TelemetryParameterization } from './telemetry-parameterization';

@Table({
  tableName: 'tblTelemetryData',
  timestamps: false,
})
export class TelemetryData extends Model<TelemetryData> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => TelemetryParameterization)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  telemetryParamId: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  value: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  timestamp: Date;
}
