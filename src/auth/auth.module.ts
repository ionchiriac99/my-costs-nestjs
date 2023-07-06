import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {TokenModule} from './token/token.module';
import {DatabaseModule} from 'src/database/database.module';
import {TokenService} from './token/token.service';
import {JwtService} from './token/jwt.service';
import {AuthGuard} from 'src/guards/auth.guard';

@Module({
	imports: [DatabaseModule, TokenModule],
	controllers: [AuthController],
	providers: [AuthService, TokenService, JwtService, AuthGuard],
})
export class AuthModule {}
