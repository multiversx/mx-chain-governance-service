import { ApiProperty } from '@nestjs/swagger';

export class TransactionDetails {
  @ApiProperty({ name: 'sender', description: 'The sender of the transaction' })
  sender?: string;

  @ApiProperty({ name: 'receiver', description: 'The receiver of the transaction' })
  receiver?: string;

  @ApiProperty({ name: 'gas limit', description: 'The maximum gas units to be consumed during the execution of the transaction' })
  gasLimit?: number;

  @ApiProperty({ name: 'gas price', description: 'The price per gas unit to be consumed during the execution of the transaction' })
  gasPrice?: number;

  @ApiProperty({ name: 'value', description: 'The EGLD amount of the transaction' })
  value?: string;

  @ApiProperty({ name: 'data', description: 'The data field of the transaction. It can contain certain SC calls functions' })
  data?: string;

  constructor(init?: Partial<TransactionDetails>) {
    Object.assign(this, init);
  }
}
