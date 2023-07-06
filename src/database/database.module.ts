import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Token, TokenSchema} from '../auth/token/token.schema';
import {Account, AccountSchema} from '../auth/account.schema';
import {Transaction, TransactionSchema} from '../transaction/transaction.schema';

const connectionString = 'mongodb://127.0.0.1:27017/my-transactions';

@Module({
	imports: [
		MongooseModule.forRoot(connectionString),
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
