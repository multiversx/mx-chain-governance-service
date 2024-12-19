import { Injectable } from '@nestjs/common';
import { GovernanceCreateProposalRequest } from '@libs/entities/entities/governance.create.proposal.request';
import { TransactionDetails } from '@libs/entities/entities/transaction.details';
import { Address, SmartContractTransactionsFactory, StringValue, TransactionsFactoryConfig, U32Value } from '@multiversx/sdk-core/out';
import { CommonConfigService } from '@libs/common';

@Injectable()
export class InteractionService {
  private readonly smartContractTransactionsFactory: SmartContractTransactionsFactory;

  constructor(
    private readonly commonConfigService: CommonConfigService,
  ) {
    const config = new TransactionsFactoryConfig({ chainID: 'D' });
    this.smartContractTransactionsFactory = new SmartContractTransactionsFactory({ config });
  }

  // TODO: implement the rest of the contract functions:
  // case "vote":
  // case "delegateVote":
  // case "changeConfig":
  // case "closeProposal":
  // case "clearEndedProposals":

  createProposal(request: GovernanceCreateProposalRequest): TransactionDetails {
    const transaction = this.smartContractTransactionsFactory.createTransactionForExecute({
      sender: new Address(request.sender as string),
      contract: new Address(this.commonConfigService.config.governance.contractAddress as string),
      function: 'proposal',
      // @ts-ignore
      gasLimit: 100_000_000n,
      arguments: [new StringValue(request.commitHash as string),
        new U32Value(request.startEpoch as number),
        new U32Value(request.endEpoch as number),
      ],
    });

    return new TransactionDetails({
      sender: transaction.sender,
      receiver: transaction.receiver,
      gasPrice: 1_000_000_000,
      gasLimit: Number(transaction.gasLimit),
      data: Buffer.from(transaction.data).toString('base64'),
    });
  }
}
