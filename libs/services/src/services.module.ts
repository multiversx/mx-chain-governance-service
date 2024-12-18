import { Global, Module } from '@nestjs/common';
import { DynamicModuleUtils } from '@libs/common';
import { ViewService } from './view/view.service';
import { VmQueryModule } from '@libs/common/vm-query/vm-query.module';

@Global()
@Module({
  imports: [
    DynamicModuleUtils.getCachingModule(),
    VmQueryModule,
  ],
  providers: [
    ViewService,
  ],
  exports: [
    ViewService,
  ],
})

export class ServicesModule { }
