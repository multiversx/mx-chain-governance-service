import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { GovernanceCreateProposalRequest } from '@libs/entities/entities/governance.create.proposal.request';

export class CreateProposalValidationPipe implements PipeTransform<GovernanceCreateProposalRequest | undefined, Promise<GovernanceCreateProposalRequest | undefined>> {
  transform(value: GovernanceCreateProposalRequest | undefined, _metadata: ArgumentMetadata): Promise<GovernanceCreateProposalRequest> {
    return new Promise(resolve => {
      if (value === undefined) {
        throw new BadRequestException(`Validation failed. Empty request body`);
      }

      if (!value.sender) {
        throw new BadRequestException(`Validation failed. Empty sender`);
      }

      if (!value.commitHash || value.commitHash.length === 40) {
        throw new BadRequestException(`Validation failed. Commit hash must have 40 characters`);
      }

      if (!value.startEpoch || !value.endEpoch) {
        throw new BadRequestException(`Validation failed. startEpoch and endEpoch must be provided`);
      }

      if (value.endEpoch < value.startEpoch) {
        throw new BadRequestException('End epoch cannot be less than start epoch');
      }

      return resolve(value);
    });
  }
}

