import { Global, Module } from '@nestjs/common';
import { DynamicModuleUtils } from '@libs/common';
import { ViewService } from './view/view.service';
import { VmQueryModule } from '@libs/common/vm-query/vm-query.module';
import { GovernanceContractModule } from './contracts/governance/governance.contract.module';
import { InteractionService } from './interactions/interaction.service';

@Global()
@Module({
  imports: [
    DynamicModuleUtils.getCachingModule(),
    VmQueryModule,
    GovernanceContractModule,
  ],
  providers: [
    ViewService,
    InteractionService,
  ],
  exports: [
    ViewService,
    InteractionService,
  ],
})

export class ServicesModule { }
