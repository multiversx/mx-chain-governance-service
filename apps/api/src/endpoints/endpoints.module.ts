import { Module } from "@nestjs/common";
import { DynamicModuleUtils } from "@libs/common";
import { ViewModule } from './view/view.module';

@Module({
  imports: [
    ViewModule,
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
  ],
})

export class EndpointsModule { }
