import { Router, Request, Response, NextFunction } from 'express';
import { randomBytes, pbkdf2 } from 'crypto';
import { sign } from 'jsonwebtoken';
import { secret, length, digest } from '../config';
import { IUser, IShareableUser } from '../models/user.interface';
import { UserSchema } from '../schemas/user.schema';
import { BaseRepository } from '../repository/base.repository';
import { DataAccess } from '../repository/_dataAccess';
import { Authorisation } from './_authorisation';

const loginRouter: Router = Router();
console.log('initializing UserRepo');
var userRepo = new BaseRepository<IUser>(DataAccess.connect().model<IUser>('User', UserSchema.schema));

loginRouter.all("/user/*", Authorisation.check);

loginRouter.post('/signup', function (request: Request, response: Response, next: NextFunction) {
    if (!request.body.hasOwnProperty('email')) {
        let err = new Error('No email');
        response.status(400);
        return next(err);
    }
    if (!request.body.hasOwnProperty('password')) {
        let err = new Error('No password');
        response.status(400);
        return next(err);
    }
    try {
        let user: IUser = <IUser>request.body;
        user.salt = randomBytes(128).toString('base64');
        console.log("user: ", user); // this should not normaly be logged
        pbkdf2(request.body.password, user.salt, 10000, 128, digest, (err: Error, hash: Buffer) => {
            user.password = hash.toString('hex');
            userRepo.create(user, (error, result) => {
                if (error) {
                    if (error.code == 11000) {
                        console.log("User" + user.email + "already exists");
                        response.status(400);
                        response.send({ "message": "user already exists" });
                    }
                    console.log(error);
                    response.status(500);
                    response.send({ "message": "Error on signup" });
                } else {
                    console.log("saved user: ", result);
                    response.send({ "success": "registration successfull" });
                }
            });
        });
    } catch (e) {
        console.log(e);
        let err = new Error("Server exception");
    }
});

// login method
loginRouter.post('/', function (request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.body.hasOwnProperty('email')) {
            let err = new Error('No email');
            response.status(400);
            response.send({ "message": "No email" });
        }
        if (!request.body.hasOwnProperty('password')) {
            let err = new Error('No password');
            response.status(400);
            response.send({ "message": "No password" })
        }
        console.log("logging in user: ", request.body.email);
        userRepo.findBy({ "email": request.body.email }, (err, result: Array<IUser>) => {
            console.log("err", err);
            console.log("result", result);
            if (err) {
                console.log(err);
                response.status(500);
                response.send({ "message": "Some error during login" });
            }
            if (result.length == 0) {
                console.log("User not found");
                response.status(404);
                response.send("User not found");
            } else {
                let user = result[0];
                pbkdf2(request.body.password, user.salt, 10000, 128, digest, (err: Error, hash: Buffer) => {
                    if (err) {
                        console.log(err);
                    }

                    // check if password is active
                    if (hash.toString('hex') === user.password) {
                        const token = sign({ 'user': user.email, permissions: [] }, secret, { expiresIn: '7d' });
                        let shareableUser = <IShareableUser>user;
                        console.log("shareable user: ", shareableUser);
                        response.json({ 'jwt': token, 'user': shareableUser });
                    } else {
                        response.json({ message: 'Login failed!' });
                    }
                });
            }
        });
    } catch (e) {

    }
});

loginRouter.get('/user', (request: Request, response: Response) => {
    userRepo.retrieve((err, users) => {
        if (err) {
            response.status(500);
            response.send({ "message": "Internal server errror" });
        } else {
            let shareableUsers = <Array<IShareableUser>>users;
            response.json({ "data": shareableUsers });
        }
    });
});

loginRouter.get('/user/myself', (request: Request & { email: string }, response: Response) => {
    let myEmail = request.email;
    userRepo.findBy({ "email": myEmail }, (err, result) => {
        if (err) {
            response.status(500);
            response.send({ "message": "Internal server errror" });
        } else {
            let myself = <IShareableUser>result[0];
            console.log("myself: ", myself);
            response.json(myself);
        }
    });
});

export { loginRouter }
