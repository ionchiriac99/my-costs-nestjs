import {IsNotEmpty, Matches, MaxLength, MinLength} from 'class-validator';

export class SignupDto {
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(256)
	firstname: string;

	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(256)
	lastname: string;

	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(256)
	@Matches(/^([0-9a-zA-Z\-_])+$/)
	username: string;

	@IsNotEmpty()
	@MinLength(6)
	@MaxLength(256)
	password: string;
}
