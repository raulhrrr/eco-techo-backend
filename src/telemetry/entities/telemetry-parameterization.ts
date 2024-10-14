import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'tblTelemetryParameterization',
  timestamps: false,
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
}
