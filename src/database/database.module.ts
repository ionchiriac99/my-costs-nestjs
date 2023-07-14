import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Token, TokenSchema} from '../auth/token/token.schema';
import {Account, AccountSchema} from '../auth/account.schema';
import {Transaction, TransactionSchema} from '../transaction/transaction.schema';
import {ConfigModule} from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.DB_CONNECTION),
		MongooseModule.forFeature([
			{
				name: Account.name,
				schema: AccountSchema,
			},
			{
				name: Token.name,
				schema: TokenSchema,
			},
			{
				name: Transaction.name,
				schema: TransactionSchema,
			},
		]),
	],
	exports: [MongooseModule],
})
export class DatabaseModule {}
