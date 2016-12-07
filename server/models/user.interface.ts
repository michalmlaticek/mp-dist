import { Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    email: string;
    password: string,
    salt: string
}

export interface IShareableUser {
    firstName: string,
    lastName: string,
    email: string;
}