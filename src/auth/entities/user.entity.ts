import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    isActive: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    updatedAt: Date;
}