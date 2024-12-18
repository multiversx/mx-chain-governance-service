import { ApiProperty } from '@nestjs/swagger';

export class GovernanceVotingPower {
  constructor(init?: Partial<GovernanceVotingPower>) {
    Object.assign(this, init);
  }

  @ApiProperty({ description: 'The voting power of the provided address.', example: '1000000000000000000' })
  votingPower?: string;

  static fromVmQueryResponse(queryResponse: any): GovernanceVotingPower {
    const returnData = queryResponse?.data?.data?.returnData;
    if (!returnData || !Array.isArray(returnData) || returnData.length === 0) {
      return new GovernanceVotingPower();
    }

    return new GovernanceVotingPower({
      votingPower: returnData[0],
    });
  }
}
