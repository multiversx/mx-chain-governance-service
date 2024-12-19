import { Global, Module } from '@nestjs/common';
import { CommonConfigModule } from '@libs/common';
import { GovernanceContractService } from './governance.contract.service';
import { VmQueryModule } from '@libs/common/vm-query/vm-query.module';

@Global()
@Module({
  imports: [
    CommonConfigModule,
    VmQueryModule,
  ],
  providers: [
    GovernanceContractService,
  ],
  exports: [
    GovernanceContractService,
  ],
})

export class GovernanceContractModule { }
