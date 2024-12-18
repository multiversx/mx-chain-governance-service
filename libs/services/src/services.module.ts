import { Global, Module } from '@nestjs/common';
import { TokenService } from './token/token.service';
import { UserService } from './user/user.service';
import { DatabaseModule } from '@libs/database';
import { ExampleService } from './example/example.service';
import { DynamicModuleUtils } from '@libs/common';
import { ViewService } from './view/view.service';
import { VmQueryModule } from '@libs/common/vm-query/vm-query.module';

@Global()
@Module({
  imports: [
    DatabaseModule,
    DynamicModuleUtils.getCachingModule(),
    VmQueryModule,
  ],
  providers: [
    TokenService,
    UserService,
    ExampleService,
    ViewService,
  ],
  exports: [
    TokenService,
    UserService,
    ExampleService,
    ViewService,
  ],
})

export class ServicesModule { }
