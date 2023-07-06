import {Module} from '@nestjs/common';
import {TokenService} from './token.service';
import {JwtService} from './jwt.service';
import {DatabaseModule} from 'src/database/database.module';
import {TokenController} from './token.controller';

@Module({
	imports: [DatabaseModule],
	providers: [TokenService, JwtService],
	controllers: [TokenController],
})
export class TokenModule {}
