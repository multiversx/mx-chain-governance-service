import { ApiProperty } from '@nestjs/swagger';
import { BinaryUtils } from '@multiversx/sdk-nestjs-common';

export class GovernanceVotingPower {
  constructor(init?: Partial<GovernanceVotingPower>) {
    Object.assign(this, init);
  }

  @ApiProperty({ description: 'The voting power of the provided address.', example: '1000000000000000000' })
  votingPower?: string;

  static fromVmQueryResponse(queryResponse: any): GovernanceVotingPower {
    if (!queryResponse) {
      return new GovernanceVotingPower({ votingPower: '0' });
    }
    const returnData = queryResponse?.data?.data?.returnData;
    if (!returnData || !Array.isArray(returnData) || returnData.length < 1) {
      throw new Error(`Cannot parse governance voting power vm-query response. Return data: ${JSON.stringify(returnData)}`);
    }

    return new GovernanceVotingPower({
      votingPower: BinaryUtils.base64ToBigInt(returnData[0]).toString(10),
    });
  }
}
