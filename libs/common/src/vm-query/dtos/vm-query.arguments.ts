export class VmQueryArguments {
  constructor(init?: Partial<VmQueryArguments>) {
    Object.assign(this, init);
  }

  contractAddress: string = '';
  functionName: string = '';
  callerAddress: string = '';
  args?: string[];

  static toGatewayBody(args: VmQueryArguments): any {
    return {
      scAddress: args.contractAddress,
      funcName: args.functionName,
      caller: args.callerAddress ?? undefined,
      args: args.args ?? undefined,
    };
  }
}
