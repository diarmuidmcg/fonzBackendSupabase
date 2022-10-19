import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'postgres',
  password: process.env.AWS_PG_PASS,
  port: 5432,
  host: process.env.AWS_HOST,
  database: 'postgres',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};
