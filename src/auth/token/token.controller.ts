import {Controller, Headers, Get} from '@nestjs/common';
import {TokenService} from './token.service';
import {Observable} from 'rxjs';

@Controller()
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

	@Get('logout')
	public logout(@Headers('authorization') authorization: string): Observable<null> {
		return this.tokenService.logout(authorization);
	}
}
