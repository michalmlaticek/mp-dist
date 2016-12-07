import { IProject } from './project.interface';

export interface IProjectGroup {
    owner: Array<IProject>;
    member: Array<IProject>;
    other: Array<IProject>;
}