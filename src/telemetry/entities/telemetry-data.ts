import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'tblTelemetryData',
  timestamps: false,
})
export class TelemetryData extends Model<TelemetryData> {
  @Column({
    type: DataType.UUIDV4,
    defaultValue: uuidv4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  temperature: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  humidity: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  pressure: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  gas_resistance: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  timestamp: Date;
}
