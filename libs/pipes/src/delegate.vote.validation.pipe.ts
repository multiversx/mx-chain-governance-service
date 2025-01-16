import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { AddressUtils } from '@multiversx/sdk-nestjs-common';
import { VoteOption } from '@libs/entities/entities/vote.option';
import { GovernanceDelegateVoteRequest } from '@libs/entities/entities/governance.delegate.vote.request';

export class DelegateVoteValidationPipe implements PipeTransform<GovernanceDelegateVoteRequest | undefined, Promise<GovernanceDelegateVoteRequest | undefined>> {
  transform(value: GovernanceDelegateVoteRequest | undefined, _metadata: ArgumentMetadata): Promise<GovernanceDelegateVoteRequest> {
    return new Promise(resolve => {
      if (value === undefined) {
        throw new BadRequestException(`Validation failed. Empty request body`);
      }

      if (!AddressUtils.isAddressValid(value.sender as string)) {
        throw new BadRequestException(`Validation failed. Invalid sender bech32 address`);
      }

      if (!AddressUtils.isAddressValid(value.delegatedTo as string)) {
        throw new BadRequestException(`Validation failed. Invalid delegatedTo bech32 address`);
      }

      if (value.voteOption in Object.values(VoteOption)) {
        throw new BadRequestException(`Validation failed. Invalid vote option. It should be one of the ${JSON.stringify(Object.values(VoteOption))}`);
      }

      if (!value.proposalNonce || isNaN(Number(value.proposalNonce))) {
        throw new BadRequestException(`Validation failed. Invalid proposal nonce`);
      }

      if (!value.balance || isNaN(Number(value.balance))) {
        throw new BadRequestException(`Validation failed. Empty balance to delegate vote for`);
      }

      return resolve(value);
    });
  }
}
