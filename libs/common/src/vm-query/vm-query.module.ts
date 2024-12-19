import { Global, Module } from '@nestjs/common';
import { VmQueryService } from './vm-query.service';
import { DynamicModuleUtils } from '../utils';

@Global()
@Module({
  imports: [
    DynamicModuleUtils.getApiModule(),
  ],
  providers: [
    VmQueryService,
  ],
  exports: [
    VmQueryService,
  ],
})

export class VmQueryModule { }
