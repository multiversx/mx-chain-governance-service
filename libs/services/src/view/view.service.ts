import { Injectable } from '@nestjs/common';
import { VmQueryService } from '@libs/common/vm-query/vm-query.service';
import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { CacheInfo, CommonConfigService } from '@libs/common';
import { VmQueryArguments } from '@libs/common/vm-query/dtos/vm-query.arguments';
import { GovernanceConfig } from '@libs/entities/entities/governance.config';
import { GovernanceProposal } from '@libs/entities/entities/governance.proposal';
import { AddressUtils, BinaryUtils } from '@multiversx/sdk-nestjs-common';

@Injectable()
export class ViewService {
  constructor(
    private readonly vmQueryService: VmQueryService,
    private readonly cacheService: CacheService,
    private readonly commonConfigService: CommonConfigService,
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

  async getProposals(from: number, to: number): Promise<any> {
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
    const vmQueryResponse = await this.vmQueryService.query(new VmQueryArguments({
      contractAddress: this.commonConfigService.config.governance.contractAddress,
      functionName: 'viewProposal',
      args: [BinaryUtils.numberToHex(proposalNonce)],
    }));

    return GovernanceProposal.fromVmQueryResponse(vmQueryResponse);
  }

  async getAddressVotingPower(address: string): Promise<any> {
    return await this.cacheService.getOrSet(
      CacheInfo.GovernanceAddressVotingPower(address).key,
      async () => await this.getAddressVotingPowerRaw(address),
      CacheInfo.GovernanceAddressVotingPower(address).ttl,
    );
  }

  async getAddressVotingPowerRaw(address: string): Promise<string> {
    const vmQueryResponse = await this.vmQueryService.query(new VmQueryArguments({
      contractAddress: this.commonConfigService.config.governance.contractAddress,
      functionName: 'viewVotingPower',
      args: [AddressUtils.bech32Decode(address)],
    }));

    const returnData = vmQueryResponse?.data?.data?.returnData;
    if (!Array.isArray(returnData) || returnData.length === 0) {
      return '0';
    }
    return BinaryUtils.base64Decode(returnData[0]);
  }

  async getDelegatedVotingInfo(address: string, delegatedAddress: string): Promise<any> {
    return await this.cacheService.getOrSet(
      CacheInfo.GovernanceDelegatedAddressVotingPower(address, delegatedAddress).key,
      async () => await this.getDelegatedVotingInfoRaw(address, delegatedAddress),
      CacheInfo.GovernanceDelegatedAddressVotingPower(address, delegatedAddress).ttl,
    );
  }

  async getDelegatedVotingInfoRaw(address: string, delegatedAddress: string): Promise<string> {
    const vmQueryResponse = await this.vmQueryService.query(new VmQueryArguments({
      contractAddress: this.commonConfigService.config.governance.contractAddress,
      functionName: 'viewDelegatedVoteInfo',
      args: [AddressUtils.bech32Decode(address), AddressUtils.bech32Decode(delegatedAddress)],
    }));

    const returnData = vmQueryResponse?.data?.data?.returnData;
    if (!Array.isArray(returnData) || returnData.length === 0) {
      return '0';
    }
    return BinaryUtils.base64Decode(returnData[0]);
  }
}
