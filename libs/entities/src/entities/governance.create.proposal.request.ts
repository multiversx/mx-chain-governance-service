import { ApiProperty } from '@nestjs/swagger';

export class GovernanceCreateProposalRequest {
  constructor(init?: Partial<GovernanceCreateProposalRequest>) {
    Object.assign(this, init);
  }

  @ApiProperty({ description: 'The address that will create the governance proposal', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  sender?: string;

  @ApiProperty({ description: 'The commit hash to start the proposal from', example: '54bce4bb3ac2cb0d38aa265c9a9fd05b8680bedd' })
  commitHash?: string;

  @ApiProperty({ description: 'The epoch when the proposal voting starts', example: 1500 })
  startEpoch?: number;

  @ApiProperty({ description: 'The epoch when the proposal voting ends', example: 1510 })
  endEpoch?: number;
}
