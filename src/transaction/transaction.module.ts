import {Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {TransactionController} from './transaction.controller';
import {TransactionService} from './transaction.service';
import {AuthGuard} from '../guards/auth.guard';
import {JwtService} from '../auth/token/jwt.service';

@Module({
	imports: [DatabaseModule],
	controllers: [TransactionController],
	providers: [AuthGuard, TransactionService, JwtService],
})
export class TransactionModule {}
