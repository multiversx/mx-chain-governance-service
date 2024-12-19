import { Injectable } from '@nestjs/common';
import { VmQueryService } from '@libs/common/vm-query/vm-query.service';
import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { CacheInfo, CommonConfigService } from '@libs/common';
import { VmQueryArguments } from '@libs/common/vm-query/dtos/vm-query.arguments';
import { GovernanceConfig } from '@libs/entities/entities/governance.config';
import { GovernanceProposal } from '@libs/entities/entities/governance.proposal';
import { GovernanceDelegatedVoteInfo } from '@libs/entities/entities/governance.delegated.vote.info';
import { GovernanceContractService } from '../contracts/governance/governance.contract.service';
import { GovernanceVotingPower } from '@libs/entities/entities/governance.voting.power';

@Injectable()
export class ViewService {
  constructor(
    private readonly vmQueryService: VmQueryService,
    private readonly cacheService: CacheService,
    private readonly commonConfigService: CommonConfigService,
    private readonly governanceContractService: GovernanceContractService,
  ) { }

  async getGovernanceConfig(): Promise<GovernanceConfig> {
    return await this.cacheService.getOrSet(
      CacheInfo.GovernanceConfig.key,
      async () => await this.getGovernanceConfigRaw(),
      CacheInfo.GovernanceConfig.ttl,
    );
  }

  async getGovernanceConfigRaw(): Promise<GovernanceConfig> {
    const vmQueryResponse = await this.vmQueryService.query(new VmQueryArguments({
      contractAddress: this.commonConfigService.config.governance.contractAddress,
      functionName: 'viewConfig',
    }));

    return GovernanceConfig.fromVmQueryResponse(vmQueryResponse);
  }

  async getProposals(from: number, to: number): Promise<GovernanceProposal[]> {
    const proposals = await this.cacheService.getOrSet(
      CacheInfo.GovernanceProposals.key,
      async () => await this.getProposalsRaw(),
      CacheInfo.GovernanceProposals.ttl,
    );

    return proposals.slice(from, to);
  }

  async getProposalsRaw(): Promise<GovernanceProposal[]> {
    const config = await this.getGovernanceConfig();
    const proposals: GovernanceProposal[] = [];
    for (let i = 0; i < (config.lastProposalNonce ?? 0); i++) {
      proposals.push(await this.getProposalDetails(i));
    }

    return proposals;
  }

  async getProposalDetails(proposalNonce: number): Promise<GovernanceProposal> {
    return await this.cacheService.getOrSet(
      CacheInfo.GovernanceProposal(proposalNonce).key,
      async () => await this.getProposalDetailsRaw(proposalNonce),
      CacheInfo.GovernanceProposal(proposalNonce).ttl,
    );
  }

  async getProposalDetailsRaw(proposalNonce: number): Promise<GovernanceProposal> {
    const vmQueryResponse = await this.governanceContractService.viewProposal(proposalNonce);

    return GovernanceProposal.fromVmQueryResponse(vmQueryResponse);
  }

  async getAddressVotingPower(address: string): Promise<GovernanceVotingPower> {
    return await this.cacheService.getOrSet(
      CacheInfo.GovernanceAddressVotingPower(address).key,
      async () => await this.getAddressVotingPowerRaw(address),
      CacheInfo.GovernanceAddressVotingPower(address).ttl,
    );
  }

  async getAddressVotingPowerRaw(address: string): Promise<GovernanceVotingPower> {
    const vmQueryResponse = await this.governanceContractService.viewVotingPower(address);

    return GovernanceVotingPower.fromVmQueryResponse(vmQueryResponse);
  }

  async getDelegatedVotingInfo(address: string, delegatedAddress: string): Promise<GovernanceDelegatedVoteInfo> {
    return await this.cacheService.getOrSet(
      CacheInfo.GovernanceDelegatedAddressVotingPower(address, delegatedAddress).key,
      async () => await this.getDelegatedVotingInfoRaw(address, delegatedAddress),
      CacheInfo.GovernanceDelegatedAddressVotingPower(address, delegatedAddress).ttl,
    );
  }

  async getDelegatedVotingInfoRaw(address: string, delegatedAddress: string): Promise<GovernanceDelegatedVoteInfo> {
    const vmQueryResponse = await this.governanceContractService.viewDelegatedVoteInfo(address, delegatedAddress);

    return GovernanceDelegatedVoteInfo.fromVmQueryResponse(vmQueryResponse);
  }
}
