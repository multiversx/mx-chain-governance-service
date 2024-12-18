import { ApiProperty } from '@nestjs/swagger';
import { BinaryUtils } from '@multiversx/sdk-nestjs-common';

export class GovernanceProposal {
  constructor(init?: Partial<GovernanceProposal>) {
    Object.assign(this, init);
  }

  @ApiProperty({ description: 'The cost of the proposal.', example: '1000000000000000000' })
  proposalCost?: string;

  @ApiProperty({ description: 'The commit hash of the proposal.', example: '54bce4bb3ac2cb0d38aa265c9a9fd05b8680bedd' })
  commitHash?: string;

  @ApiProperty({ description: 'The nonce of the proposal.', example: 37 })
  proposalNonce?: number;

  @ApiProperty({ description: 'The address of the proposal\'s issuer address.', example: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th' })
  issuerAddress?: string;

  @ApiProperty({ description: 'The epoch when the vote can start.', example: 1512 })
  startVoteEpoch?: number;

  @ApiProperty({ description: 'The epoch when the vote will end.', example: 1522 })
  endVoteEpoch?: number;

  @ApiProperty({ description: 'The stake of the quorum.' })
  quorumStake?: string;

  @ApiProperty({ description: 'The accumulated voting power for the \'yes\' option.', example: '1000000000000000000' })
  yes?: string;

  @ApiProperty({ description: 'The accumulated voting power for the \'no\' option.', example: '1000000000000000000' })
  no?: string;

  @ApiProperty({ description: 'The accumulated voting power for the \'veto\' option.', example: '1000000000000000000' })
  veto?: string;

  @ApiProperty({ description: 'The accumulated voting power for the \'abstain\' option.', example: '1000000000000000000' })
  abstain?: string;

  @ApiProperty({ description: 'The fee required for submitting a new proposal.', example: false })
  closed?: boolean;

  @ApiProperty({ description: 'The fee required for submitting a new proposal.', example: true })
  passed?: boolean;

  static fromVmQueryResponse(queryResponse: any): GovernanceProposal {
    const returnData = queryResponse?.data?.data?.returnData;
    if (!returnData || !Array.isArray(returnData || returnData.length === 0)) {
      return new GovernanceProposal();
    }

    return new GovernanceProposal({
      proposalCost: BinaryUtils.base64Decode(returnData[0]),
      commitHash: BinaryUtils.base64Decode(returnData[1]),
      proposalNonce: parseInt(BinaryUtils.base64Decode(returnData[2])),
      startVoteEpoch: parseInt(BinaryUtils.base64Decode(returnData[3])),
      endVoteEpoch: parseInt(BinaryUtils.base64Decode(returnData[4])),
      quorumStake: BinaryUtils.base64Decode(returnData[5]),
      yes: BinaryUtils.base64Decode(returnData[6]),
      no: BinaryUtils.base64Decode(returnData[7]),
      veto: BinaryUtils.base64Decode(returnData[8]),
      abstain: BinaryUtils.base64Decode(returnData[9]),
      closed: BinaryUtils.base64Decode(returnData[10]) === 'true',
      passed: BinaryUtils.base64Decode(returnData[11]) === 'true',
    });
  }
}
