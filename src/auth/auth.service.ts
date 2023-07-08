import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Account, AccountDocument} from './account.schema';
import * as bcrypt from 'bcrypt';
import {SignupDto} from './dtos/singup.dto';
import {Observable, forkJoin, from, map, mergeMap, of, tap} from 'rxjs';
import {SigninDto} from './dtos/signin.dto';
import {TokenDto} from './token/token.dto';
import {TokenService} from './token/token.service';
import {IAccount} from 'src/interfaces/account';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(Account.name)
		private model: Model<AccountDocument>,
		private readonly tokenService: TokenService
	) {}

	public signup(signupDto: SignupDto): Observable<null> {
		const validate$ = from(
			this.model.findOne({
				username: signupDto.username,
			})
		).pipe(
			tap((data) => {
				if (data) {
					throw new BadRequestException({message: 'Username already exists'});
				}
			})
		);

		const salt$: Observable<string> = from(bcrypt.genSalt()) as Observable<string>;
		const password$: (salt: string) => Observable<string> = (salt: string) =>
			from(bcrypt.hash(signupDto.password, salt)) as Observable<string>;

		const account$ = (data) => from(new this.model(data).save());

		return validate$.pipe(
			mergeMap(() => salt$),
			mergeMap((salt: string) => password$(salt)),
			tap((password: string) => (signupDto.password = password)),
			mergeMap(() => account$(signupDto)),
			map(() => null)
		);
	}

	public signin(siginDto: SigninDto): Observable<TokenDto> {
		const account$ = from(
			this.model.findOne(
				{
					username: siginDto.username,
				},
				{
					_id: 1,
					password: 1,
				}
			)
		);

		return account$.pipe(
			tap((account) => {
				if (account === null) {
					throw new UnauthorizedException({
						message: 'Incorrect username',
					});
				}
			}),
			mergeMap((account) =>
				forkJoin({
					user: of(account),
					check: from(bcrypt.compare(siginDto.password, account.password)),
				})
			),
			tap((data) => {
				if (data.check === false) {
					throw new UnauthorizedException({message: 'Incorrect password'});
				}
			}),
			mergeMap((data) => this.tokenService.generateToken(data.user._id))
		);
	}

	public me(userId: string): Observable<IAccount> {
		return from(
			this.model.findById(userId, {
				_id: 0,
				password: 0,
			})
		).pipe(
			tap((data) => {
				if (!data) {
					return new UnauthorizedException();
				}
			})
		);
	}
}
