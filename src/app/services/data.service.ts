import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {
    IGeneralResp, IProjectGroup,
    IProject, IMeetingMinutes, IGeneralProject
} from '../interfaces';

@Injectable()
export class DataService {
    url: string;
    constructor(private http: Http) {
        this.url = "http://localhost:4300/api/project"
    }

    private authHeader(jwt: string): Headers {
        let headers = new Headers();
        headers.append('Authorization', jwt);
        return headers;
    }

    getProjectsByOwnership(): Observable<IProjectGroup> {
        let urlByOwner: string = this.url + "/by_ownership";

        let jwt: string = localStorage.getItem("auth_token");
        let headers = this.authHeader(jwt);

        return this.http.get(urlByOwner, { headers: headers })
            .map((projectGroup: Response) => {
                console.log("projectGroupResponse: ", projectGroup);
                return projectGroup.json()
            })
            .catch((err: any) => Observable.throw(err.json().error || 'Server error'));
    }

    createProject(project: IGeneralProject): Observable<IProject> {

        let jwt: string = localStorage.getItem("auth_token");
        let headers = this.authHeader(jwt);

        return this.http.post(this.url, project, { headers: headers })
            .map((createResp: Response) => createResp.json())
            .catch((err: any) => Observable.throw(err.json().error || 'Server error'));
    }

    updateProject(id: string, project: IGeneralProject): Observable<IGeneralResp> {
        let updateProjectUrl = this.url + "/" + id;
        let jwt: string = localStorage.getItem("auth_token");
        let headers = this.authHeader(jwt);

        return this.http.put(updateProjectUrl, project, { headers: headers })
            .map((createResp: Response) => createResp.json())
            .catch((err: any) => Observable.throw(err.json().error || 'Server error'));
    }

    addMeetingMinutes(id: string, meetingMinutes: IMeetingMinutes): Observable<IGeneralResp> {
        let addMMUrl = this.url + "/" + id + "/meeting_minutes";

        let jwt: string = localStorage.getItem("auth_token");

        let headers = this.authHeader(jwt);

        return this.http.put(addMMUrl, meetingMinutes, { headers: headers })
            .map((addMMResponse: Response) => addMMResponse.json())
            .catch((err: any) => Observable.throw(err.json().error || 'Server error'))
    }

}
