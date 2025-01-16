import { Injectable } from '@nestjs/common';
import { GovernanceCreateProposalRequest } from '@libs/entities/entities/governance.create.proposal.request';
import { TransactionDetails } from '@libs/entities/entities/transaction.details';
import { Address, AddressValue, BigUIntValue, SmartContractTransactionsFactory, StringValue, TransactionsFactoryConfig, U32Value } from '@multiversx/sdk-core/out';
import { CommonConfigService } from '@libs/common';
import { GovernanceVoteRequest } from '@libs/entities/entities/governance.vote.request';
import { GovernanceDelegateVoteRequest } from '@libs/entities/entities/governance.delegate.vote.request';
import { GovernanceCloseProposalRequest } from '@libs/entities/entities/governance.close.proposal.request';
import { GovernanceClearProposalsRequest } from '@libs/entities/entities/governance.clear.proposals.request';
import { GovernanceChangeConfigRequest } from '@libs/entities/entities/governance.change.config.request';
import { ViewService } from '../view/view.service';

@Injectable()
export class InteractionService {
  private readonly smartContractTransactionsFactory: SmartContractTransactionsFactory;

  constructor(
    private readonly commonConfigService: CommonConfigService,
    private readonly viewService: ViewService,
  ) {
    const config = new TransactionsFactoryConfig({ chainID: 'D' });
    this.smartContractTransactionsFactory = new SmartContractTransactionsFactory({ config });
  }

  async createProposal(request: GovernanceCreateProposalRequest): Promise<TransactionDetails> {
    const transaction = this.smartContractTransactionsFactory.createTransactionForExecute({
      sender: new Address(request.sender as string),
      contract: new Address(this.commonConfigService.config.governance.contractAddress as string),
      function: 'proposal',
      gasLimit: this.getGasLimit(100_000_000),
      arguments: [
        new StringValue(request.commitHash as string),
        new U32Value(request.startEpoch as number),
        new U32Value(request.endEpoch as number),
      ],
    });

    const governanceConfig = await this.viewService.getGovernanceConfig();
    return new TransactionDetails({
      sender: transaction.sender,
      receiver: transaction.receiver,
      value: governanceConfig.proposalFee || '0',
      gasPrice: 1_000_000_000,
      gasLimit: Number(transaction.gasLimit),
      data: Buffer.from(transaction.data).toString('base64'),
    });
  }

  vote(request: GovernanceVoteRequest): TransactionDetails {
    const transaction = this.smartContractTransactionsFactory.createTransactionForExecute({
      sender: new Address(request.sender),
      contract: new Address(this.commonConfigService.config.governance.contractAddress),
      function: 'vote',
      gasLimit: this.getGasLimit(100_000_000),
      arguments: [
        new U32Value(request.proposalNonce),
        new StringValue(request.voteOption),
      ],
    });

    return new TransactionDetails({
      sender: transaction.sender,
      receiver: transaction.receiver,
      value: '0',
      gasPrice: 1_000_000_000,
      gasLimit: Number(transaction.gasLimit),
      data: Buffer.from(transaction.data).toString('base64'),
    });
  }

  delegateVote(request: GovernanceDelegateVoteRequest): TransactionDetails {
    const transaction = this.smartContractTransactionsFactory.createTransactionForExecute({
      sender: new Address(request.sender),
      contract: new Address(this.commonConfigService.config.governance.contractAddress),
      function: 'delegateVote',
      gasLimit: this.getGasLimit(100_000_000),
      arguments: [
        new U32Value(request.proposalNonce),
        new StringValue(request.voteOption),
        new AddressValue(new Address(request.delegatedTo)),
        new BigUIntValue(request.balance),
      ],
    });

    return new TransactionDetails({
      sender: transaction.sender,
      receiver: transaction.receiver,
      value: '0',
      gasPrice: 1_000_000_000,
      gasLimit: Number(transaction.gasLimit),
      data: Buffer.from(transaction.data).toString('base64'),
    });
  }

  closeProposal(request: GovernanceCloseProposalRequest): TransactionDetails {
    const transaction = this.smartContractTransactionsFactory.createTransactionForExecute({
      sender: new Address(request.sender),
      contract: new Address(this.commonConfigService.config.governance.contractAddress),
      function: 'closeProposal',
      gasLimit: this.getGasLimit(100_000_000),
      arguments: [
        new U32Value(request.proposalNonce),
      ],
    });

    return new TransactionDetails({
      sender: transaction.sender,
      receiver: transaction.receiver,
      value: '0',
      gasPrice: 1_000_000_000,
      gasLimit: Number(transaction.gasLimit),
      data: Buffer.from(transaction.data).toString('base64'),
    });
  }

  clearEndedProposals(request: GovernanceClearProposalsRequest): TransactionDetails {
    const transaction = this.smartContractTransactionsFactory.createTransactionForExecute({
      sender: new Address(request.sender),
      contract: new Address(this.commonConfigService.config.governance.contractAddress),
      function: 'clearEndedProposals',
      gasLimit: this.getGasLimit(200_000_000),
      arguments: [
        new AddressValue(new Address(request.voterAddress)),
      ],
    });

    return new TransactionDetails({
      sender: transaction.sender,
      receiver: transaction.receiver,
      value: '0',
      gasPrice: 1_000_000_000,
      gasLimit: Number(transaction.gasLimit),
      data: Buffer.from(transaction.data).toString('base64'),
    });
  }

  changeConfig(request: GovernanceChangeConfigRequest): TransactionDetails {
    const transaction = this.smartContractTransactionsFactory.createTransactionForExecute({
      sender: new Address(request.sender),
      contract: new Address(this.commonConfigService.config.governance.contractAddress),
      function: 'changeConfig',
      gasLimit: this.getGasLimit(100_000_000),
      arguments: [
        new StringValue(request.proposalFee),
        new StringValue(request.lostProposalFee),
        new StringValue(`${request.minQuorum}`),
        new StringValue(`${request.minVeto}`),
        new StringValue(`${request.minPass}`),
      ],
    });

    return new TransactionDetails({
      sender: transaction.sender,
      receiver: transaction.receiver,
      value: '0',
      gasPrice: 1_000_000_000,
      gasLimit: Number(transaction.gasLimit),
      data: Buffer.from(transaction.data).toString('base64'),
    });
  }

  private getGasLimit(gasLimit: number): bigint {
    return BigInt(gasLimit);
  }
}
