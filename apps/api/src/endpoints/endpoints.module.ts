import { Module } from "@nestjs/common";
import { DynamicModuleUtils } from "@libs/common";
import { ViewModule } from './view/view.module';
import { InteractionModule } from './interaction/interaction.module';

@Module({
  imports: [
    ViewModule,
    InteractionModule,
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
  ],
})

export class EndpointsModule { }
