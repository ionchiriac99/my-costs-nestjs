import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {TransactionModule} from './transaction/transaction.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, TransactionModule],
	controllers: [AppController],
})
export class AppModule {}
