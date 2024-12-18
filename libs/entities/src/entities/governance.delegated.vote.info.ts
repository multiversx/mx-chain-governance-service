import { ApiProperty } from '@nestjs/swagger';
import { BinaryUtils } from '@multiversx/sdk-nestjs-common';

export class GovernanceDelegatedVoteInfo {
  constructor(init?: Partial<GovernanceDelegatedVoteInfo>) {
    Object.assign(this, init);
  }

  @ApiProperty({ description: 'The used stake for the delegated address.', example: '1000000000000000000' })
  usedStake?: string;

  @ApiProperty({ description: 'The used power for the delegated address.', example: '1000000000000000000' })
  usedPower?: string;

  @ApiProperty({ description: 'The total stake of the address.', example: '1000000000000000000' })
  totalStake?: string;

  @ApiProperty({ description: 'The address power of the address.', example: '1000000000000000000' })
  totalPower?: string;

  static fromVmQueryResponse(queryResponse: any): GovernanceDelegatedVoteInfo {
    const returnData = queryResponse?.data?.data?.returnData;
    if (!returnData || !Array.isArray(returnData || returnData.length === 0)) {
      return new GovernanceDelegatedVoteInfo();
    }

    return new GovernanceDelegatedVoteInfo({
      usedStake: BinaryUtils.base64Decode(returnData[0]),
      usedPower: BinaryUtils.base64Decode(returnData[1]),
      totalStake: BinaryUtils.base64Decode(returnData[2]),
      totalPower: BinaryUtils.base64Decode(returnData[3]),
    });
  }
}
