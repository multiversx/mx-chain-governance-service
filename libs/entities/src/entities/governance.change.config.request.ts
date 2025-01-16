import { ApiProperty } from '@nestjs/swagger';

export class GovernanceChangeConfigRequest {
  @ApiProperty({ description: 'The address of the sender', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  sender: string = '';

  @ApiProperty({ description: 'The proposal fee as a string', example: '1000000000000000000' })
  proposalFee: string = '';

  @ApiProperty({ description: 'The lost proposal fee as a string', example: '1000000000000000000' })
  lostProposalFee: string = '';

  @ApiProperty({ description: 'Minimum quorum percentage (0-10000)', example: 10000 })
  minQuorum: number = 0;

  @ApiProperty({ description: 'Minimum veto percentage (0-10000)', example: 9000 })
  minVeto: number = 0;

  @ApiProperty({ description: 'Minimum pass percentage (0-10000)', example: 8000 })
  minPass: number = 0;

  constructor(init?: Partial<GovernanceChangeConfigRequest>) {
    Object.assign(this, init);
  }
}
