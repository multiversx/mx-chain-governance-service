import { BinaryUtils } from '@multiversx/sdk-nestjs-common';
import { ApiProperty } from '@nestjs/swagger';
import { VmQueryResponse } from '@libs/common/vm-query/dtos/vm-query.response';

export class GovernanceConfig {
  constructor(init?: Partial<GovernanceConfig>) {
    Object.assign(this, init);
  }

  @ApiProperty({ description: 'The fee required for submitting a new proposal.' })
  proposalFee?: string;

  @ApiProperty({ description: 'The minimum quorum required for a proposal.' })
  minQuorum?: number;

  @ApiProperty({ description: 'The minimum pass threshold required for a proposal.' })
  minPassThreshold?: number;

  @ApiProperty({ description: 'The minimum veto threshold required for a proposal' })
  minVetoThreshold?: number;

  @ApiProperty({ description: 'The nonce of the last proposal.' })
  lastProposalNonce?: number;

  static fromVmQueryResponse(queryResponse: VmQueryResponse): GovernanceConfig {
    const returnData = queryResponse?.data?.data?.returnData;
    if (!returnData || !Array.isArray(returnData) || returnData.length < 5) {
      throw new Error(`Cannot parse governance config vm-query response. Return data: ${JSON.stringify(returnData)}`);
    }

    return new GovernanceConfig({
      proposalFee: BinaryUtils.base64Decode(returnData[0]),
      minQuorum: parseFloat(BinaryUtils.base64Decode(returnData[1])),
      minPassThreshold: parseFloat(BinaryUtils.base64Decode(returnData[2])),
      minVetoThreshold: parseFloat(BinaryUtils.base64Decode(returnData[3])),
      lastProposalNonce: parseInt(BinaryUtils.base64Decode(returnData[4])),
    });
  }
}
