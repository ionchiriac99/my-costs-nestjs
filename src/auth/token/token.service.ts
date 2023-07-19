import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Token, TokenDocument} from './token.schema';
import {Model, Types} from 'mongoose';
import {JwtService} from './jwt.service';
import {Observable, catchError, from, map, mergeMap} from 'rxjs';
import {TokenDto} from './token.dto';

@Injectable()
export class TokenService {
	constructor(
		@InjectModel(Token.name)
		private model: Model<TokenDocument>,
		private readonly jwtService: JwtService
	) {}

	public logout(authorization: string): Observable<null> {
		if (authorization === null) return null;

		const bearer = authorization.split(' ');
		const token: string = bearer.length != 2 ? null : bearer[1];

		const data$ = this.jwtService.verify(token).pipe(
			catchError(() => {
				throw new UnauthorizedException();
			}),
			map((response: any) => response.data)
		);

		return data$.pipe(
			mergeMap((data) =>
				from(
					this.model
						.deleteOne({
							_id: new Types.ObjectId(data._id),
							account: new Types.ObjectId(data.account),
						})
						.exec()
				)
			),
			map(() => null)
		);
	}

	public generateToken(account: Types.ObjectId): Observable<TokenDto> {
		const exp: number = Math.floor(Date.now() / 1000) + 2678400;
		const token = new this.model({
			account: new Types.ObjectId(account),
		});
		const model$: Observable<TokenDocument> = from(token.save());

		return model$.pipe(
			mergeMap((model: TokenDocument) =>
				this.jwtService.sign({
					data: {
						_id: model._id,
						account: account,
					},
					exp: exp,
				})
			),
			map((jwt: string) => new TokenDto(jwt, exp))
		);
	}
}
