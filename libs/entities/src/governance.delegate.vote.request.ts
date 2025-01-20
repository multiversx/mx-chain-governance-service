import { ApiProperty } from '@nestjs/swagger';
import { VoteOption } from './vote.option';

export class GovernanceDelegateVoteRequest {
  @ApiProperty({ description: 'The address of the sender', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  sender: string = '';

  @ApiProperty({ description: 'The proposal nonce', example: 0 })
  proposalNonce: number = 0;

  @ApiProperty({ description: 'The vote option (yes, no, veto, abstain)', example: 'yes', enum: VoteOption })
  voteOption: string = '';

  @ApiProperty({ description: 'The address to which the vote is delegated', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  delegatedTo: string = '';

  @ApiProperty({ description: 'The balance to vote', example: '10500000000000000000' })
  balance: string = '';

  constructor(init?: Partial<GovernanceDelegateVoteRequest>) {
    Object.assign(this, init);
  }
}
