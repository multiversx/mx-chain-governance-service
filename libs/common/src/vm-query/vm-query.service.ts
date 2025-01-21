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

      if (response?.data?.data?.data?.returnCode === 'user error') {
        this.logger.warn(`User error while performing a vm-query to the contract ${args.contractAddress} with function name ${args.functionName} and args ${JSON.stringify(args.args)}. Return code: ${response?.data?.data?.data?.returnCode}. Return message: ${response?.data?.data?.data?.returnMessage}`);
        this.logger.warn(response?.data?.data?.returnCode);
        this.logger.warn(response?.data?.data?.returnMessage);
        return undefined;
      }

      return response.data;
    }
    catch (error) {
      this.logger.warn(`Error while performing a vm-query to the contract ${args.contractAddress} with function name ${args.functionName} and args ${JSON.stringify(args.args)}`);
      this.logger.warn(error);
    }
  }
}
