import { Module } from '@nestjs/common';
import { ServicesModule } from '@libs/services/services.module';
import { ViewController } from './view.controller';

@Module({
  imports: [
    ServicesModule,
  ],
  controllers: [
    ViewController,
  ],
})

export class ViewModule { }
