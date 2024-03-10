import { DataSource, DataSourceOptions } from 'typeorm';
import configuration from './config';

const config = configuration();

export const configOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.POSTGRES_HOST,
  port: +config.POSTGRES_PORT!,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/common/migrations/*.js'],
};

const configTypeorm = new DataSource(configOptions);

export default configTypeorm;
