import { VmQueryService } from '@libs/common/vm-query/vm-query.service';
import { CommonConfigService } from '@libs/common';
import { VmQueryArguments } from '@libs/common/vm-query/dtos/vm-query.arguments';
import { AddressUtils, BinaryUtils } from '@multiversx/sdk-nestjs-common';
import { VmQueryResponse } from '@libs/common/vm-query/dtos/vm-query.response';

export class GovernanceContractService {
  constructor(
    private readonly commonConfigService: CommonConfigService,
    private readonly vmQueryService: VmQueryService,
  ) { }

  async viewConfig(): Promise<VmQueryResponse> {
    return await this.vmQueryService.query(new VmQueryArguments({
      contractAddress: this.commonConfigService.config.governance.contractAddress,
      functionName: 'viewConfig',
    }));
  }

  async viewProposal(proposalNonce: number): Promise<VmQueryResponse> {
    return await this.vmQueryService.query(new VmQueryArguments({
      contractAddress: this.commonConfigService.config.governance.contractAddress,
      functionName: 'viewProposal',
      args: [BinaryUtils.numberToHex(proposalNonce)],
    }));
  }

  async viewVotingPower(address: string): Promise<VmQueryResponse> {
    return await this.vmQueryService.query(new VmQueryArguments({
      contractAddress: this.commonConfigService.config.governance.contractAddress,
      functionName: 'viewVotingPower',
      args: [AddressUtils.bech32Decode(address)],
    }));
  }

  async viewDelegatedVoteInfo(address: string, delegatedAddress: string): Promise<VmQueryResponse> {
    return await this.vmQueryService.query(new VmQueryArguments({
      contractAddress: this.commonConfigService.config.governance.contractAddress,
      functionName: 'viewDelegatedVoteInfo',
      args: [AddressUtils.bech32Decode(address), AddressUtils.bech32Decode(delegatedAddress)],
    }));
  }
}
