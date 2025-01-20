import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { AddressUtils } from '@multiversx/sdk-nestjs-common';
import { GovernanceClearProposalsRequest } from '@libs/entities/governance.clear.proposals.request';

export class ClearProposalsValidationPipe implements PipeTransform<GovernanceClearProposalsRequest | undefined, Promise<GovernanceClearProposalsRequest | undefined>> {
  transform(value: GovernanceClearProposalsRequest | undefined, _metadata: ArgumentMetadata): Promise<GovernanceClearProposalsRequest> {
    return new Promise(resolve => {
      if (value === undefined) {
        throw new BadRequestException(`Validation failed. Empty request body`);
      }

      if (!AddressUtils.isAddressValid(value.sender as string)) {
        throw new BadRequestException(`Validation failed. Invalid sender bech32 address`);
      }

      if (!AddressUtils.isAddressValid(value.voterAddress as string)) {
        throw new BadRequestException(`Validation failed. Invalid voter bech32 address`);
      }

      return resolve(value);
    });
  }
}
