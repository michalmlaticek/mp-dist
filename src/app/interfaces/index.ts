import * as moment from 'moment';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IAuthResp {
    jwt: string;
    user: IUser;
}

export interface ICredentials {
    email: string;
    password: string;
}

export interface IGeneralResp {
    message: string;
}

export interface ITask {
    taskName: string;
    taskDescription: string;
    dueDate: moment.Moment;
    taskOwner: string;
}

export interface IMeetingMinutes {
    meetingDate: Date;
    author: string;
    notes: string;
    tasks: Array<ITask>;
}

export interface IGeneralProject {
    _id: string;
    name: string;
    description: string;
    members: Array<string>;
}

export interface IProject extends IGeneralProject {
    owner: string;
    meetingMinutes: Array<IMeetingMinutes>;
}

export interface IProjectGroup {
    owner: Array<IProject>;
    member: Array<IProject>;
    other: Array<IProject>;
}

export interface ArrayResponse<T> {
    data: Array<T>;
}

