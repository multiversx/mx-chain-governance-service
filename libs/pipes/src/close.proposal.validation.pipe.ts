import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { AddressUtils } from '@multiversx/sdk-nestjs-common';
import { GovernanceCloseProposalRequest } from '@libs/entities/entities/governance.close.proposal.request';

export class CloseProposalValidationPipe implements PipeTransform<GovernanceCloseProposalRequest | undefined, Promise<GovernanceCloseProposalRequest | undefined>> {
  transform(value: GovernanceCloseProposalRequest | undefined, _metadata: ArgumentMetadata): Promise<GovernanceCloseProposalRequest> {
    return new Promise(resolve => {
      if (value === undefined) {
        throw new BadRequestException(`Validation failed. Empty request body`);
      }

      if (!AddressUtils.isAddressValid(value.sender as string)) {
        throw new BadRequestException(`Validation failed. Invalid sender bech32 address`);
      }

      if (!value.proposalNonce || isNaN(Number(value.proposalNonce))) {
        throw new BadRequestException(`Validation failed. Invalid proposal nonce`);
      }

      return resolve(value);
    });
  }
}
