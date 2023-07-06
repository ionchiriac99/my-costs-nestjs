import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignupDto} from './dtos/singup.dto';
import {Observable} from 'rxjs';
import {SigninDto} from './dtos/signin.dto';
import {TokenDto} from './token/token.dto';
import {AuthGuard} from '../guards/auth.guard';
import {IAccount} from '../interfaces/account';
import {User} from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('ping')
	public ping(): string {
		return 'pong';
	}

	@Post('signup')
	public signup(@Body() signupDto: SignupDto): Observable<null> {
		return this.authService.signup(signupDto);
	}

	@Post('signin')
	public signin(@Body() signinDto: SigninDto): Observable<TokenDto> {
		return this.authService.signin(signinDto);
	}

	@UseGuards(AuthGuard)
	@Get('me')
	public me(@User() userId: string): Observable<IAccount> {
		return this.authService.me(userId);
	}
}
