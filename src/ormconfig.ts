import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres', 
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'idpay200416',
  database: 'tebengan',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: ['src/migrations/**/*{.ts,.js}'],
};

export default TypeOrmConfig;