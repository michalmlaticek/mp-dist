import { Document } from 'mongoose';

export interface ITask extends Document {
    taskName: string;
    taskDescription: string;
    dueDate: Date;
    owner: string;
}