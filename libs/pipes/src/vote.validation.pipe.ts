import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { AddressUtils } from '@multiversx/sdk-nestjs-common';
import { GovernanceVoteRequest } from '@libs/entities/entities/governance.vote.request';
import { VoteOption } from '@libs/entities/entities/vote.option';

export class VoteValidationPipe implements PipeTransform<GovernanceVoteRequest | undefined, Promise<GovernanceVoteRequest | undefined>> {
  transform(value: GovernanceVoteRequest | undefined, _metadata: ArgumentMetadata): Promise<GovernanceVoteRequest> {
    return new Promise(resolve => {
      if (value === undefined) {
        throw new BadRequestException(`Validation failed. Empty request body`);
      }

      if (!AddressUtils.isAddressValid(value.sender as string)) {
        throw new BadRequestException(`Validation failed. Invalid sender bech32 address`);
      }

      if (value.voteOption in Object.values(VoteOption)) {
        throw new BadRequestException(`Validation failed. Invalid vote option. It should be one of the ${JSON.stringify(Object.values(VoteOption))}`);
      }

      if (!value.proposalNonce) {
        throw new BadRequestException(`Validation failed. Invalid proposal nonce`);
      }

      return resolve(value);
    });
  }
}
