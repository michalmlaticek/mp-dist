import { Router, Response, Request, NextFunction } from 'express';
import { verify, decode } from 'jsonwebtoken';
import { secret } from '../config';

export class Authorisation {
    static check = (request: Request & { headers: { authorization: string } } & { email: string },
        response: Response, next: NextFunction) => {
        const token = request.headers.authorization;
        console.log("token: ", token);
        verify(token, secret, function (tokenError, decoded) {
            if (tokenError) {
                return response.status(403).json({
                    message: 'Invalid token, please Log in first'
                });
            } else {
                console.log("decoded: ", decoded);
                request.email = decoded.user;
                console.log("request.email: ", request.email);
            }

            next();
        });
    };
}