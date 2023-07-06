import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {TransactionModule} from './transaction/transaction.module';

@Module({
	imports: [AuthModule, TransactionModule],
	controllers: [AppController],
})
export class AppModule {}
