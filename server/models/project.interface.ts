import { Document } from 'mongoose';
import { IMeetingMinutes } from './meeting-minutes.interface';
import { IUser } from './user.interface';

export interface IProject extends Document {
    name: string;
    description: string;
    owner: string;
    members: Array<string>;
    meetingMinutes: Array<IMeetingMinutes>;
}