import { Constants } from '@multiversx/sdk-nestjs-common';

export class CacheInfo {
  key: string = "";
  ttl: number = Constants.oneSecond() * 6;

  static LastProcessedNonce(shardId: number): CacheInfo {
    return {
      key: `lastProcessedNonce:${shardId}`,
      ttl: Constants.oneMonth(),
    };
  }

  static Examples: CacheInfo = {
    key: "examples",
    ttl: Constants.oneHour(),
  };

  static GovernanceConfig: CacheInfo = {
    key: 'governanceConfig',
    ttl: 10 * Constants.oneMinute(),
  };

  static GovernanceProposals: CacheInfo = {
    key: 'governanceProposals',
    ttl: Constants.oneHour(),
  };

  static GovernanceProposal(nonce: number): CacheInfo {
    return {
      key: `proposal:${nonce}`,
      ttl: Constants.oneMinute(),
    };
  }

  static GovernanceAddressVotingPower(address: string): CacheInfo {
    return {
      key: `votingPower:${address}`,
      ttl: Constants.oneMinute(),
    };
  }

  static GovernanceDelegatedAddressVotingPower(address: string, delegatedAddress: string): CacheInfo {
    return {
      key: `delegatedVotingPower:${address}:${delegatedAddress}`,
      ttl: Constants.oneMinute(),
    };
  }
}
