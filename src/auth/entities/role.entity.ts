import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { User } from './user.entity';

@Table({
  tableName: 'tblRoles',
  timestamps: false,
})
export class Role extends Model<Role> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasOne(() => User)
  user: User;
}
