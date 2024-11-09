import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { TelemetryData } from './telemetry-data';

@Table({
  tableName: 'tblTelemetryParameterization',
})
export class TelemetryParameterization extends Model<TelemetryParameterization> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  label: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  initialValue: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  append: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  minValue: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  maxValue: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  lowerThreshold: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  upperThreshold: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isAlertEnabled: boolean;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  updatedAt: Date;

  @HasMany(() => TelemetryData)
  telemetryData: TelemetryData[];
}
