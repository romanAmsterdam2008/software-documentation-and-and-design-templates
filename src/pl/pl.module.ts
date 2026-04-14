import { Module } from '@nestjs/common';
import { BllModule } from '../bll/bll.module';

@Module({
  imports: [BllModule],
  controllers: [],
})
export class PlModule {}
