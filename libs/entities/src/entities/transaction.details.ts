import { ApiProperty } from '@nestjs/swagger';

export class TransactionDetails {
  @ApiProperty()
  sender?: string;

  @ApiProperty()
  receiver?: string;

  @ApiProperty()
  gasLimit?: number;

  @ApiProperty()
  gasPrice?: number;

  @ApiProperty()
  value?: string;

  @ApiProperty()
  data?: string;

  constructor(init?: Partial<TransactionDetails>) {
    Object.assign(this, init);
  }
}
