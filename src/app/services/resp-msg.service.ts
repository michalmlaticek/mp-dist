import { Injectable } from '@angular/core';

@Injectable()
export class RespMsgService {

  constructor() { }

  loginFailed(): string {
    return "Invalid User name or password";
  }

  signupSuccess(): string {
    return "Registration successfull. You can now log in";
  }

  userAlreadyExists(): string {
    return "User already exist";
  }

  getProjectGroupFailed(): string {
    return "Retrieveing projects failed. There was a server error. Plese contact administrator";
  }

  getUpdateFailed(): string {
    return "Update of project failed";
  }

  getCreateProjectFailed(): string {
    return "Creating project failed";
  }

}
