import {IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, Matches, MaxLength, MinLength} from 'class-validator';
import {Types} from 'mongoose';

export class TransactionDto {
	@IsOptional()
	account: Types.ObjectId;

	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(256)
	text: string;

	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	value: number;

	@IsNotEmpty()
	@IsIn(['encashment', 'expense'])
	type: string;

	@IsNotEmpty()
	createdAt: Date;
}
