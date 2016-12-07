import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { IAuthResp, ICredentials, IUser, IGeneralResp, ArrayResponse } from '../interfaces';

@Injectable()
export class LoginService {
  private url: string;
  constructor(private http: Http) {
    this.url = "/api/login"
  }

  login(credentials: ICredentials): Observable<IAuthResp> {
    let loginUrl: string = this.url;

    return this.http.post(loginUrl, credentials)
      .map((res: Response) => {
        let authResp = <IAuthResp>res.json();
        localStorage.setItem("auth_token", authResp.jwt);
        return authResp;
      })
      .catch((err: any) => Observable.throw(err.json().error || 'Server error'));
  }

  signup(user: IUser): Observable<IGeneralResp> {
    let regUrl = this.url + "/signup";

    return this.http.post(regUrl, user)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error || 'Server error'));
  }

  getUsers(): Observable<ArrayResponse<IUser>> {
    let usersUrl = this.url + "/user";
    let headers = new Headers();
    headers.append('Authorization', localStorage.getItem("auth_token"));

    return this.http.get(usersUrl, { headers: headers })
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error || 'Server error'));
  }

  getMyself(): Observable<IUser> {
    let myselfUrl = this.url + "/user/myself";
    let headers = new Headers();
    headers.append('Authorization', localStorage.getItem("auth_token"));

    return this.http.get(myselfUrl, { headers: headers })
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json().error || 'Server error'));
  }
}
