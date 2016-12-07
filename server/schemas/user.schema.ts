import { Schema } from 'mongoose';

export class UserSchema {
    static get schema(): Schema {
        var schema = new Schema({
            firstName: String,
            lastName: String,
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            salt: {
                type: String,
                required: true
            }
        });

        return schema;
    }
}