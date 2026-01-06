import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntity } from '../../entities/config.entity';
import { ConfigService } from './config.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
