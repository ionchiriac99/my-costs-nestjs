import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Types} from 'mongoose';

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return new Types.ObjectId(request.user);
	},
);
