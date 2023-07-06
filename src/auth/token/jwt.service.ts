import {Injectable, InternalServerErrorException} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import {Observable} from 'rxjs';

@Injectable()
export class JwtService {
	private readonly algorithm: string = process.env.JWT_ALGORITHM || 'HS256';
	private readonly privateKey: string = process.env.JWT_PRIVATE_KEY || 'private_key';

	public sign(payload: string | object | Buffer, options?: jwt.SignOptions): Observable<string> {
		if (options && options.algorithm == undefined) {
			options.algorithm = this.algorithm as jwt.Algorithm;
		}

		return new Observable((subscriber) => {
			jwt.sign(payload, this.privateKey, options, (err, token) => {
				if (err) {
					subscriber.error(new InternalServerErrorException());
				}

				subscriber.next(token);
				subscriber.complete();
			});
		});
	}

	public verify(token: string): Observable<string | object | Buffer> {
		return new Observable((subscriber) => {
			jwt.verify(token, this.privateKey, (err, decoded) => {
				if (err) {
					subscriber.error(err);
				}

				subscriber.next(decoded);
				subscriber.complete();
			});
		});
	}
}
