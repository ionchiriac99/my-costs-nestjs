import {Body, Controller, Param, Post, UseGuards, Get, Put, Delete} from '@nestjs/common';
import {Observable} from 'rxjs';
import {TransactionService} from './transaction.service';
import {AuthGuard} from '../guards/auth.guard';
import {TransactionDto} from './transaction.dto';
import {User} from '../decorators/user.decorator';
import {ITransaction} from '../interfaces/transaction';

@Controller('transaction')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@UseGuards(AuthGuard)
	@Get(':id')
	public get(@User() userId: string, @Param('id') id: string): Observable<ITransaction> {
		return this.transactionService.get(userId, id);
	}

	@UseGuards(AuthGuard)
	@Get('')
	public getAll(@User() userId: string): Observable<ITransaction[]> {
		return this.transactionService.getAll(userId);
	}

	@UseGuards(AuthGuard)
	@Post('')
	public post(@User() userId: string, @Body() transactionDto: TransactionDto): Observable<null> {
		return this.transactionService.post(userId, transactionDto);
	}

	@UseGuards(AuthGuard)
	@Put(':id')
	public put(
		@User() userId: string,
		@Body() transactionDto: TransactionDto,
		@Param('id') id: string
	): Observable<null> {
		return this.transactionService.put(userId, id, transactionDto);
	}

	@UseGuards(AuthGuard)
	@Delete(':id')
	public delete(@User() userId: string, @Param('id') id: string): Observable<null> {
		return this.transactionService.delete(userId, id);
	}
}
