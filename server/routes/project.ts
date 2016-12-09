import { Router, Response, Request } from 'express';
import * as uuid from 'node-uuid';
import { Authorisation } from './_authorisation';
import { BaseRepository } from '../repository/base.repository';
import { ProjectRepository } from '../repository/project.repository';
import { DataAccess } from '../repository/_dataAccess';
import { IProject } from '../models/project.interface';
import { IProjectGroup } from '../models/project-group.interface';
import { ProjectSchema } from '../schemas/project.schema';
import { IMeetingMinutes } from '../models/meeting-minutes.interface';

console.log('initializing ProjectRepo');
// var projectRepo = new BaseRepository<IProject>(DataAccess.connect().model<IProject>('Project', ProjectSchema.schema));
var projectRepo = new ProjectRepository(DataAccess.connect());

const projectRouter: Router = Router();

projectRouter.use(Authorisation.check);

projectRouter.post('/', (request: Request & { email: string }, response: Response) => {
    console.log("calling project post");
    try {
        let project: IProject = <IProject>request.body;
        project.owner = request.email;
        console.log("inserting project: ", project);
        projectRepo.create(project, (err, result) => {
            if (err) {
                if (err.code == 11000) {
                    let msg = "project with name: " + project.name + " already exists";
                    console.log(msg);
                    response.status(400);
                    response.send({ "message": msg });
                }
                response.status(500);
                response.send({ "message": "Internal server error" });
            } else {
                console.log("New project: ", result);
                response.status(200);
                response.json(result);
            }
        });
    } catch (e) {
        console.log("exception: ", e);
        response.status(400);
        response.send({ "message": "Bad request" })
    }
});

projectRouter.put('/:id', (request: Request, response: Response) => {
    try {
        // only name and description will be updated
        console.log("put body: ", request.body);
        let inProject = <IProject>request.body;
        console.log("incommin project: ", inProject);
        let project = <IProject>{
            name: inProject.name,
            description: inProject.description,
            members: inProject.members
        }
        let projectId = request.params['id'];
        console.log("updating project with id: ", projectId);
        projectRepo.update(projectId, project, (err, result) => {
            if (err) {
                response.send({ "message": "Internal server error" });
            } else {
                console.log("Update successfull: ", result);
                response.send({ "message": "successfull" });
            }
        });
    } catch (e) {
        console.log("exception occured: ", e);
    }
});

projectRouter.delete('/:id', (request: Request, response: Response) => {
    let projectId = request.params['id'];
    console.log("deleting project with id: ", projectId)
    projectRepo.delete(projectId, (err, result) => {
        if (err) {
            response.status(500);
            response.send({ "message": "Internal server error" });
        } else {
            response.send({ "message": "successfull" })
        }
    });
});

projectRouter.get('/', (request: Request, response: Response) => {
    projectRepo.retrieve((err, result) => {
        if (err) {
            response.status(500);
            response.send({ "message": "Internal server errror" });
        } else {
            response.json({ "data": result });
        }
    });
});

projectRouter.get('/:id', (request: Request, response: Response) => {
    let projectId = request.params['id'];
    projectRepo.findById(projectId, (err, result) => {
        if (err) {
            response.status(500);
            response.send({ "message": "Internal server errror" });
        } else {
            response.json(result);
        }
    });
});

projectRouter.get('/all/by_ownership', (request: Request & { email: string }, response: Response) => {
    let userEmail = request.email;
    console.log("userEmail", userEmail);
    projectRepo.retrieve((err, result) => {
        if (err) {
            console.log("projectRepo.retrieve error")
            response.status(500);
            response.send({ "message": "Internal server errror" });
        } else {
            let projects = <Array<IProject>>result;
            console.log("projects: ", projects);
            let projectGroup = <IProjectGroup>{
                owner: new Array<IProject>(),
                member: new Array<IProject>(),
                other: new Array<IProject>()
            };
            projects.forEach(project => {
                if (project.owner == userEmail) {
                    projectGroup.owner.push(project);
                } else if (project.members.indexOf(userEmail) != -1) {
                    projectGroup.member.push(project);
                } else {
                    projectGroup.other.push(project);
                }
            });
            console.log("projectGroup: ", projectGroup);
            response.json(projectGroup);
        }
    })
});

projectRouter.put('/:id/meeting_minutes', (request: Request & { email: string }, response: Response) => {
    let projectId = request.params['id'];
    console.log("Adding meeting minutes to project with id: ", projectId);

    let meeting_minutes = <IMeetingMinutes>request.body;
    meeting_minutes.meetingDate = new Date();
    meeting_minutes.author = request.email;
    console.log("updating meeting minutes: ", meeting_minutes);
    projectRepo.addMeetingMinutes(projectId, meeting_minutes, (err, result) => {
        if (err) {
            console.log("projectRepo.addMeetingMinutes error: ", err);
            response.status(500);
            response.send({ "message": "Internal server errror" });
        } else {
            console.log("updated project id: ", result['_id']);
            projectRepo.findById(result['_id'], (err, updatedProj) => {
                if (err) {
                    console.log("update succesfull, but retrieving of updated failed.", err);
                    response.status(500);
                    response.send({ "message": "Internal server errror" });
                } else {
                    console.log("Adding meeting_minutes successfull: ", updatedProj);
                    response.json(updatedProj);
                }
            });
        }
    });
});

export { projectRouter }
