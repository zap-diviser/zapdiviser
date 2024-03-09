import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const configOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT!,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/common/db/migrations/*.js'],
};

const configTypeorm = new DataSource(configOptions);

export default configTypeorm;
