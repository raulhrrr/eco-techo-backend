import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { TelemetryData } from './telemetry-data';

@Table({
  tableName: 'tblAlerts',
  timestamps: false,
})
export class Alert extends Model<Alert> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;

  @ForeignKey(() => TelemetryData)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  telemetryDataId: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  timestamp: Date;
}
