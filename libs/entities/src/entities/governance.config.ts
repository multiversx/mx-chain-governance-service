import { BinaryUtils } from '@multiversx/sdk-nestjs-common';
import { ApiProperty } from '@nestjs/swagger';

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

  static fromVmQueryResponse(queryResponse: any): GovernanceConfig {
    return new GovernanceConfig({
      proposalFee: BinaryUtils.base64Decode(queryResponse?.data?.data?.returnData[0]),
      minQuorum: parseFloat(BinaryUtils.base64Decode(queryResponse?.data?.data?.returnData[1])),
      minPassThreshold: parseFloat(BinaryUtils.base64Decode(queryResponse?.data?.data?.returnData[2])),
      minVetoThreshold: parseFloat(BinaryUtils.base64Decode(queryResponse?.data?.data?.returnData[3])),
      lastProposalNonce: parseInt(BinaryUtils.base64Decode(queryResponse?.data?.data?.returnData[4])),
    });
  }
}
