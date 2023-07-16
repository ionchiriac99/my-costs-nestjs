import {CanActivate, ExecutionContext, Inject, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {catchError, map, mergeMap, tap, Observable} from 'rxjs';
import {Account, AccountDocument} from 'src/auth/account.schema';
import {JwtService} from 'src/auth/token/jwt.service';
import {Token, TokenDocument} from 'src/auth/token/token.schema';

export class AuthGuard implements CanActivate {
	constructor(
		@InjectModel(Token.name)
		private tokenModel: Model<TokenDocument>,
		@InjectModel(Account.name)
		private accountModel: Model<AccountDocument>,
		@Inject(JwtService) private readonly jwtService: JwtService
	) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const authorization = request.get('Authorization');

		if (authorization == null) return false;

		const bearer = authorization.split(' ');
		const token: string = bearer.length != 2 ? null : bearer[1];

		if (token == null) return false;

		return this.jwtService.verify(token).pipe(
			catchError(() => {
				throw new UnauthorizedException();
			}),
			map((response: any) => response.data),
			mergeMap((data) => this.tokenModel.findById(data._id)),
			tap((token: TokenDocument) => {
				if (token == null) {
					throw new UnauthorizedException();
				}
			}),
			mergeMap((token: TokenDocument) => this.accountModel.findById(token.account)),
			tap((account: AccountDocument) => {
				if (account == null) {
					throw new UnauthorizedException();
				}
			}),
			map((account: AccountDocument) => account._id),
			tap((userId) => (request.user = userId)),
			map(() => true)
		);
	}
}
