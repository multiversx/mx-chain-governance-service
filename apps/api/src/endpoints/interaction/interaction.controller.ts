import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { GovernanceCreateProposalRequest } from '@libs/entities/governance.create.proposal.request';
import { TransactionDetails } from '@libs/entities/transaction.details';
import { InteractionService } from '@libs/services/interactions';
import { GovernanceCloseProposalRequest } from '@libs/entities/governance.close.proposal.request';
import { GovernanceClearProposalsRequest } from '@libs/entities/governance.clear.proposals.request';
import { GovernanceChangeConfigRequest } from '@libs/entities/governance.change.config.request';
import { GovernanceVoteRequest } from '@libs/entities/governance.vote.request';
import { GovernanceDelegateVoteRequest } from '@libs/entities/governance.delegate.vote.request';
import { CreateProposalValidationPipe } from '@libs/pipes';
import { VoteValidationPipe } from '@libs/pipes';
import { DelegateVoteValidationPipe } from '@libs/pipes/delegate.vote.validation.pipe';
import { CloseProposalValidationPipe } from '@libs/pipes/close.proposal.validation.pipe';
import { ClearProposalsValidationPipe } from '@libs/pipes/clear.proposals.validation.pipe';
import { ChangeConfigValidationPipe } from '@libs/pipes/change.config.validation.pipe';

@ApiTags('interactions')
@Controller('interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) { }

  @Post('/proposals')
  @ApiOkResponse({ status: 200, description: 'Receives details about a new proposal and returns the transaction details for performing the protocol level issuing', type: TransactionDetails })
  async createProposal(
    @Body(new CreateProposalValidationPipe()) createProposalRequest: GovernanceCreateProposalRequest,
  ): Promise<TransactionDetails> {
    return await this.interactionService.createProposal(createProposalRequest);
  }

  @Post('/vote')
  @ApiOkResponse({ status: 200, description: 'Receives details about a new vote and returns the transaction details for performing the protocol level issuing.', type: TransactionDetails })
  vote(
    @Body(new VoteValidationPipe()) request: GovernanceVoteRequest,
  ): TransactionDetails {
    return this.interactionService.vote(request);
  }

  @Post('/delegate-vote')
  @ApiOkResponse({ status: 200, description: 'Delegate vote processed successfully.', type: TransactionDetails })
  delegateVote(
    @Body(new DelegateVoteValidationPipe()) request: GovernanceDelegateVoteRequest,
  ): TransactionDetails {
    return this.interactionService.delegateVote(request);
  }

  @Post('/close-proposal')
  @ApiOkResponse({ status: 200, description: 'Receives details about closing a proposal and returns the transaction details for performing the protocol level issuing.', type: TransactionDetails })
  closeProposal(
    @Body(new CloseProposalValidationPipe()) request: GovernanceCloseProposalRequest,
  ): TransactionDetails {
    return this.interactionService.closeProposal(request);
  }

  @Post('/clear-ended-proposals')
  @ApiResponse({ status: 200, description: 'Receives details about for clearing ended proposal and returns the transaction details for performing the protocol level issuing.', type: TransactionDetails })
  clearEndedProposals(
    @Body(new ClearProposalsValidationPipe()) request: GovernanceClearProposalsRequest,
  ): TransactionDetails {
    return this.interactionService.clearEndedProposals(request);
  }

  @Post('/change-config')
  @ApiOkResponse({ status: 200, description: 'Receives details about changing configuration and returns the transaction details for performing the protocol level issuing.', type: TransactionDetails })
  changeConfig(
    @Body(new ChangeConfigValidationPipe()) request: GovernanceChangeConfigRequest,
  ): TransactionDetails {
    return this.interactionService.changeConfig(request);
  }
}
