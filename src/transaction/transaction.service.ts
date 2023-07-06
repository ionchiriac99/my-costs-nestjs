import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {Transaction, TransactionDocument} from './transaction.schema';
import {Observable, from, map, mergeMap, tap} from 'rxjs';
import {ITransaction} from '../interfaces/transaction';
import {TransactionDto} from './transaction.dto';

@Injectable()
export class TransactionService {
	constructor(
		@InjectModel(Transaction.name)
		private readonly model: Model<TransactionDocument>
	) {}

	public get(userId: string, transactionId): Observable<ITransaction> {
		return this.findById(userId, transactionId);
	}

	public getAll(userId: string): Observable<ITransaction[]> {
		return from(
			this.model.find({
				account: userId,
			})
		).pipe(map((data) => data as ITransaction[]));
	}

	public post(userId: string, transactionDto: TransactionDto): Observable<null> {
		transactionDto.account = new Types.ObjectId(userId);
		const model$ = from(new this.model(transactionDto).save());

		return model$.pipe(map(() => null));
	}

	public put(userId: string, transactionId: string, transactionDto: TransactionDto): Observable<null> {
		const transaction$ = this.findById(userId, transactionId);

		const update$ = from(
			this.model.updateOne(
				{
					_id: transactionId,
				},
				{
					$set: {
						value: transactionDto.value,
						createdAt: transactionDto.createdAt,
						text: transactionDto.text,
						type: transactionDto.type,
					},
				}
			)
		);

		return transaction$.pipe(
			mergeMap(() => update$),
			map(() => null)
		);
	}

	public delete(userId: string, transactionId: string): Observable<null> {
		const transaction$ = this.findById(userId, transactionId);

		const delete$ = from(
			this.model.deleteOne({
				_id: transactionId,
			})
		);

		return transaction$.pipe(
			mergeMap(() => delete$),
			map(() => null)
		);
	}

	private findById(userId: string, transactionId: string): Observable<ITransaction> {
		return from(this.model.findById(transactionId)).pipe(
			tap((data) => {
				if (data === null) {
					throw new NotFoundException();
				}

				if (data.account.toString() !== userId.toString()) {
					throw new UnauthorizedException();
				}
			})
		);
	}
}
