import {Types} from 'mongoose';

export interface ITransaction {
	_id: string;
	account: string | Types.ObjectId;
	text: string;
	type: string;
	value: number;
	createdAt: Date;
}
