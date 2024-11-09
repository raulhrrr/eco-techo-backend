import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript';
import { TelemetryParameterization } from './telemetry-parameterization';
import { Alert } from './alerts';

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

  @BelongsTo(() => TelemetryParameterization)
  telemetryParameterization: TelemetryParameterization;

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

  @HasOne(() => Alert)
  alert: Alert;
}
