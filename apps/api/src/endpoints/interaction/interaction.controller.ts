import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { TransactionDetails } from '@libs/entities/entities/transaction.details';
import { GovernanceCreateProposalRequest } from '@libs/entities/entities/governance.create.proposal.request';
import { InteractionService } from '@libs/services/interactions';

@Controller()
export class InteractionController {
  constructor(
    private readonly interactionService: InteractionService,
  ) { }

  @Post('/proposals')
  @ApiOperation({
    summary: 'Create a new proposal',
    description: 'Receives details about a new proposal and returns the transaction details for performing the protocol level issuing',
  })
  @ApiOkResponse({ type: TransactionDetails })
  createProof(
    @Body() createProposalRequest: GovernanceCreateProposalRequest,
  ): TransactionDetails {
    return this.interactionService.createProposal(createProposalRequest);
  }
}
