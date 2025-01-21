import { ApiProperty } from '@nestjs/swagger';
import { VoteOption } from './vote.option';

export class GovernanceVoteRequest {
  @ApiProperty({ description: 'The address of the sender', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  sender: string = '';

  @ApiProperty({ description: 'The nonce of the proposal', example: 5 })
  proposalNonce: number = 0;

  @ApiProperty({ description: 'The vote option (yes, no, veto, abstain)', example: 'yes', enum: VoteOption })
  voteOption: VoteOption = VoteOption.abstain;

  constructor(init?: Partial<GovernanceVoteRequest>) {
    Object.assign(this, init);
  }
}
