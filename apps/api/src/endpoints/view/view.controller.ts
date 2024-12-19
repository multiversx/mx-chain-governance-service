import { Controller, DefaultValuePipe, Get, Param, Query } from '@nestjs/common';
import { ViewService } from '@libs/services/view/view.service';
import { ParseAddressPipe, ParseIntPipe } from '@multiversx/sdk-nestjs-common';
import { ApiQuery } from '@nestjs/swagger';
import { GovernanceProposal } from '@libs/entities/entities/governance.proposal';
import { GovernanceVotingPower } from '@libs/entities/entities/governance.voting.power';
import { GovernanceDelegatedVoteInfo } from '@libs/entities/entities/governance.delegated.vote.info';

@Controller()
export class ViewController {
  constructor(
    private readonly viewService: ViewService,
  ) { }

  @Get('/governance-config')
  async getGovernanceConfig(): Promise<any> {
    return await this.viewService.getGovernanceConfig();
  }

  @Get('/proposals')
  @ApiQuery({ name: 'from', description: 'Number of items to skip for the result set', required: false })
  @ApiQuery({ name: 'size', description: 'Number of items to retrieve', required: false })
  async getGovernanceProposals(
    @Query('from', new DefaultValuePipe(0), ParseIntPipe) from: number,
    @Query('size', new DefaultValuePipe(25), ParseIntPipe) size: number,
  ): Promise<GovernanceProposal[]> {
    return await this.viewService.getProposals(from, size);
  }

  @Get('/proposals/:nonce')
  @ApiQuery({ name: 'nonce', description: 'The proposal\'s nonce', required: false })
  async getGovernanceProposal(
    @Param('nonce', ParseIntPipe) nonce: number,
  ): Promise<GovernanceProposal> {
    return await this.viewService.getProposalDetails(nonce);
  }

  @Get('/voting-power/:address')
  @ApiQuery({ name: 'address', description: 'The address to fetch the voting power for', required: false })
  async getVotingPower(
    @Param('address', ParseAddressPipe) address: string,
  ): Promise<GovernanceVotingPower> {
    return await this.viewService.getAddressVotingPower(address);
  }

  @Get('/delegated-voting-info/:address/:delegatedAddress')
  @ApiQuery({ name: 'address', description: 'The address that delegated the voting power', required: false })
  @ApiQuery({ name: 'delegatedAddress', description: 'The address that voting power was delegated for', required: false })
  async getDelegatedVotingPower(
    @Param('address', ParseAddressPipe) address: string,
    @Param('delegatedAddress', ParseAddressPipe) delegatedAddress: string,
  ): Promise<GovernanceDelegatedVoteInfo> {
    return await this.viewService.getDelegatedVotingInfo(address, delegatedAddress);
  }
}
