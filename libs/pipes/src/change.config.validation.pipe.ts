import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { AddressUtils } from '@multiversx/sdk-nestjs-common';
import { GovernanceChangeConfigRequest } from '@libs/entities/governance.change.config.request';

export class ChangeConfigValidationPipe implements PipeTransform<GovernanceChangeConfigRequest | undefined, Promise<GovernanceChangeConfigRequest | undefined>> {
  transform(value: GovernanceChangeConfigRequest | undefined, _metadata: ArgumentMetadata): Promise<GovernanceChangeConfigRequest> {
    return new Promise(resolve => {
      if (value === undefined) {
        throw new BadRequestException(`Validation failed. Empty request body`);
      }

      if (!AddressUtils.isAddressValid(value.sender as string)) {
        throw new BadRequestException(`Validation failed. Invalid sender bech32 address`);
      }

      if (!value.proposalFee || isNaN(Number(value.proposalFee))) {
        throw new BadRequestException(`Validation failed. Invalid proposal fee`);
      }

      if (!value.lostProposalFee || isNaN(Number(value.lostProposalFee))) {
        throw new BadRequestException(`Validation failed. Invalid lost proposal fee`);
      }

      if (!value.minPass || isNaN(Number(value.minPass))) {
        throw new BadRequestException(`Validation failed. Invalid minPass argument`);
      }

      if (!value.minVeto || isNaN(Number(value.minVeto))) {
        throw new BadRequestException(`Validation failed. Invalid minVeto argument`);
      }

      if (!value.minQuorum || isNaN(Number(value.minQuorum))) {
        throw new BadRequestException(`Validation failed. Invalid minQuorum argument`);
      }

      return resolve(value);
    });
  }
}
