import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { GovernanceCreateProposalRequest } from '@libs/entities/governance.create.proposal.request';
import { AddressUtils } from '@multiversx/sdk-nestjs-common';

export class CreateProposalValidationPipe implements PipeTransform<GovernanceCreateProposalRequest | undefined, Promise<GovernanceCreateProposalRequest | undefined>> {
  transform(value: GovernanceCreateProposalRequest | undefined, _metadata: ArgumentMetadata): Promise<GovernanceCreateProposalRequest> {
    return new Promise(resolve => {
      if (value === undefined) {
        throw new BadRequestException(`Validation failed. Empty request body`);
      }

      if (!AddressUtils.isAddressValid(value.sender as string)) {
        throw new BadRequestException(`Validation failed. Invalid sender bech32 address`);
      }

      if (!value.commitHash || value.commitHash.length !== 40) {
        throw new BadRequestException(`Validation failed. Commit hash must have 40 characters`);
      }

      if (!value.startEpoch || !value.endEpoch || isNaN(Number(value.startEpoch)) || isNaN(Number(value.endEpoch))) {
        throw new BadRequestException(`Validation failed. startEpoch and endEpoch must be provided as numerical values`);
      }

      if (value.endEpoch < value.startEpoch) {
        throw new BadRequestException('End epoch cannot be less than start epoch');
      }

      return resolve(value);
    });
  }
}
