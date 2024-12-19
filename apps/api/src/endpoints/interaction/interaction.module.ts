import { Module } from '@nestjs/common';
import { ServicesModule } from '@libs/services/services.module';
import { InteractionController } from './interaction.controller';

@Module({
  imports: [
    ServicesModule,
  ],
  controllers: [
    InteractionController,
  ],
})

export class InteractionModule { }
