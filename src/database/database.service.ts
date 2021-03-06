import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '../../src/config/config.keys';
import { ConfigModule } from '../../src/config/config.module';
import { ConfigService } from '../../src/config/config.service';
import { ConnectionOptions } from 'typeorm';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      return {
        type: 'postgres' as const,
        host: config.get(Configuration.HOST),
        username: config.get(Configuration.USERNAME),
        port: 5444,
        database: config.get(Configuration.DATABASE),
        password: config.get(Configuration.PASSWORD),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      } as ConnectionOptions;
    },
  }),
];
