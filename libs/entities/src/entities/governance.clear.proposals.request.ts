import { ApiProperty } from '@nestjs/swagger';

export class GovernanceClearProposalsRequest {
  @ApiProperty({ description: 'The address of the sender', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  sender: string = '';

  @ApiProperty({ description: 'The address of the voter', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  voterAddress: string = '';

  constructor(init?: Partial<GovernanceClearProposalsRequest>) {
    Object.assign(this, init);
  }
}
