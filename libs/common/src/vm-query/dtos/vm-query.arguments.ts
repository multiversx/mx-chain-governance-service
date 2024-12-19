export class VmQueryArguments {
  constructor(init?: Partial<VmQueryArguments>) {
    Object.assign(this, init);
  }

  contractAddress: string = '';
  functionName: string = '';
  callerAddress: string = '';
  args?: string[];

  static toGatewayBody(args: VmQueryArguments): any {
    const { contractAddress, functionName, callerAddress, args: functionArgs } = args;
    return {
      scAddress: contractAddress,
      funcName: functionName,
      caller: callerAddress,
      args: functionArgs,
    };
  }
}
