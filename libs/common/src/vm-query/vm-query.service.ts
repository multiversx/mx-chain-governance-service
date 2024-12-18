import { Injectable } from "@nestjs/common";
import { ApiService } from '@multiversx/sdk-nestjs-http';
import { VmQueryArguments } from './dtos/vm-query.arguments';
import { CommonConfigService } from '../config';
import { OriginLogger } from '@multiversx/sdk-nestjs-common';

@Injectable()
export class VmQueryService {
  private readonly logger = new OriginLogger(VmQueryService.name);

  constructor(
    private readonly commonConfigService: CommonConfigService,
    private readonly apiService: ApiService,
  ) { }

  async query(args: VmQueryArguments): Promise<any> {
    try {
      const response = await this.apiService.post(`${this.commonConfigService.config.urls.gateway}/vm-values/query`, VmQueryArguments.toGatewayBody(args));

      return response.data;
    }
    catch (error) {
      this.logger.warn(`Error while performing a vm-query to the contract ${args.contractAddress} with function name ${args.functionName} and args ${JSON.stringify(args.args)}`);
      this.logger.warn(error);
    }
  }
}
