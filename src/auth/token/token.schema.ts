import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({versionKey: false})
export class Token {
	@Prop({required: true, type: Types.ObjectId})
	account: Types.ObjectId;

	@Prop({default: () => Date.now(), expires: 2678400})
	createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
