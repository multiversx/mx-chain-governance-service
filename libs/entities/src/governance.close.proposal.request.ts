import { ApiProperty } from '@nestjs/swagger';

export class GovernanceCloseProposalRequest {
  @ApiProperty({ description: 'The address of the sender', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  sender: string = '';

  @ApiProperty({ description: 'The nonce of the proposal to close', example: 5 })
  proposalNonce: string = '';

  constructor(init?: Partial<GovernanceCloseProposalRequest>) {
    Object.assign(this, init);
  }
}
