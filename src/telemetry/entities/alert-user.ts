import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { User } from '../../auth/entities';
import { Alert } from './alerts';

@Table({
  tableName: 'tblAlertUser',
  timestamps: false,
})
export class AlertUser extends Model<AlertUser> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Alert)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  alertId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  timestamp: Date;
}
