import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  autoLoadModels: true,
  synchronize: true,
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typeCast: function (field, next) {
      if (
        ['DATE', 'DATETIME', 'TIMESTAMP', 'TIMESTAMP WITH TIME ZONE'].includes(
          field.type,
        )
      ) {
        return field.string();
      }
      return next();
    },
  },
  timezone: '-05:00',
};
