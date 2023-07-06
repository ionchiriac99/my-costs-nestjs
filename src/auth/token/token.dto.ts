import {Prop} from '@nestjs/mongoose';

export class TokenDto {
	@Prop()
	jwt: string;

	@Prop()
	exp: number;

	constructor(jwt: string, exp: number) {
		this.jwt = jwt;
		this.exp = exp;
	}
}
