import { Schema } from 'mongoose';

export class ProjectSchema {
    static get schema(): Schema {
        return new Schema({
            name: {
                type: String,
                required: true,
                unique: true
            },
            description: {
                type: String,
                required: true
            },
            owner: {
                type: String,
                required: true
            },
            members: [String],
            meetingMinutes: [{
                meetingDate: Date,
                author: String,
                notes: String,
                tasks: [{
                    taskName: String,
                    taskDescription: String,
                    dueDate: Date,
                    taskOwner: String
                }]
            }]
        });
    }
}