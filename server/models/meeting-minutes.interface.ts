import { Document } from 'mongoose';
import { ITask } from './task.interface';

export interface IMeetingMinutes extends Document {
    meetingDate: Date;
    author: string;
    notes: string;
    tasks: Array<ITask>;
}