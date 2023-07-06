import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({versionKey: false})
export class Transaction {
	@Prop({type: Types.ObjectId})
	account: Types.ObjectId;

	@Prop()
	text: string;

	@Prop()
	value: number;

	@Prop({enum: ['encashment', 'expense']})
	type: string;

	@Prop()
	createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
