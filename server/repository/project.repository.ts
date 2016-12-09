import { Document, Model, Types, Connection } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IProject } from '../models/project.interface';
import { IMeetingMinutes } from '../models/meeting-minutes.interface';
import { ProjectSchema } from '../schemas/project.schema';

export class ProjectRepository extends BaseRepository<IProject> {

    constructor(connection: Connection) {
        super(connection.model<IProject>('Project', ProjectSchema.schema));
    }

    addMeetingMinutes(id: string, meetingMinutes: IMeetingMinutes, callback: Function) {
        this._model.findByIdAndUpdate(
            id,
            { $push: { "meetingMinutes": meetingMinutes } },
            callback
        );
    }

}