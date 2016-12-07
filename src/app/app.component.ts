import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormBuilder, Validator, FormArray } from '@angular/forms';

import { Observable } from 'rxjs';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { LoginService } from './services/login.service';
import { DataService } from './services/data.service';
import { RespMsgService } from './services/resp-msg.service';
import {
  IAuthResp, ICredentials, IUser,
  IGeneralResp, IProject, IProjectGroup,
  IMeetingMinutes, ITask, IGeneralProject
} from './interfaces';
import * as moment from 'moment';

enum EView {
  login, project_list, project_detail, edit_project
}

enum ELoginTab {
  login, signup
}

enum EMMSubView {
  list, read, add
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn: boolean = false;
  errorMessage: string;
  successMessage: string;

  activeView: EView;
  isLoginActive() {
    return this.activeView == EView.login;
  }
  isProjectListActive() {
    return this.activeView == EView.project_list;
  }
  isProjectDetailActive() {
    return this.activeView == EView.project_detail;
  }
  isEditProjectActive() {
    return this.activeView == EView.edit_project;
  }

  // login
  credentials: ICredentials;
  activeUser: IUser;
  activeLoginTab: ELoginTab
  cssLoginTab: string = "";
  cssSignupTab: string = "";
  loginForm: FormGroup;
  signUpForm: FormGroup;

  //project_list
  projectGroup: IProjectGroup;

  // project_detail, edit_project
  activeProject: IProject;
  projectEditForm: FormGroup;
  activeMembers: Array<string> = new Array<string>();
  allUsers: Array<IUser> = new Array<IUser>();

  // meeting minutes
  mmForm: FormGroup;
  mmTaskForm: FormArray;
  mmSubView: EMMSubView = EMMSubView.list;
  activeMM: IMeetingMinutes;

  constructor(private loginService: LoginService,
    private dataService: DataService,
    private respMsgService: RespMsgService,
    private fb: FormBuilder) {
    this.activeView = EView.login;
  }

  ngOnInit() {
    this.initView();
  }

  initView() {
    console.log("auth_token: ", localStorage.getItem("auth_token"));
    if (localStorage.getItem("auth_token")) {
      this.initMyself();
    } else {
      this.initLogin();
    }
  }

  initMyself() {
    this.loginService.getMyself()
      .subscribe(
      myself => {
        this.activeUser = myself;
        this.isLoggedIn = true;
        this.showProjectList();
      },
      err => {
        console.log("token expired");
        this.initLogin();
      }
      );
  }

  changeLoginTab() {
    if (this.activeLoginTab == ELoginTab.login) {
      this.activeLoginTab = ELoginTab.signup;
      this.cssLoginTab = "";
      this.cssSignupTab = "active-tab";
    } else {
      this.activeLoginTab = ELoginTab.login;
      this.cssLoginTab = "active-tab";
      this.cssSignupTab = "";
    }
  }

  private initLogin() {
    this.initLoginForm();
    this.initSignUpForm();
    this.cssLoginTab = "active-tab";
    this.cssSignupTab = "";
    this.activeLoginTab = ELoginTab.login;
  }

  private initLoginForm() {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  private initSignUpForm() {
    this.signUpForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      password: ['']
    });
  }

  onLoginSubmit({value, valid}: { value: ICredentials, valid: boolean }) {

    this.loginService.login(value)
      .subscribe(
      loginResp => {
        localStorage.setItem("auth_token", loginResp.jwt);
        this.isLoggedIn = true;
        this.activeUser = loginResp.user;
        console.log("Active user: ", this.activeUser);
        this.showProjectList();
      },
      err => {
        this.showError(this.respMsgService.loginFailed());
      }
      )
  }

  onSignupSubmit({value, valid}: { value: IUser, valid: boolean }) {
    console.log("signing up user: ", value);
    this.loginService.signup(value)
      .subscribe(
      signupResp => {
        console.log("Signup successfull");
        this.successMessage = this.respMsgService.signupSuccess();
        this.changeLoginTab();
      },
      err => {
        this.showError(this.respMsgService.userAlreadyExists());
      }
      )
  }

  initProjectEditForm(project) {
    this.projectEditForm = this.fb.group({
      name: [project.name],
      description: [project.description]
    });
  }

  showProjectList() {
    this.getProjectsByOwnership();
    this.activeView = EView.project_list;
  }

  getProjectsByOwnership() {
    this.dataService.getProjectsByOwnership()
      .subscribe(
      projectGroup => {
        console.log("projectGroup: ", projectGroup);
        this.projectGroup = projectGroup;
      },
      err => {
        this.showError(this.respMsgService.getProjectGroupFailed());
      }
      )
  }

  showProjectDetails(project: IProject) {
    this.activeProject = project;
    this.activeView = EView.project_detail;
    this.mmSubView = EMMSubView.list;
  }

  closeProjectDetails() {
    this.activeView = EView.project_list;
  }

  showAddProject() {
    this.activeProject = null;
    let project = <IGeneralProject>{
      name: null,
      description: null
    }
    this.initProjectEditForm(project);
    this.activeView = EView.edit_project;
  }

  closeAddProject() {
    this.activeView = EView.project_list;
  }

  showEditProject() {
    let project = <IProject>{
      name: this.activeProject.name,
      description: this.activeProject.description
    };
    this.activeMembers = this.activeProject.members;
    this.initProjectEditForm(project);
    this.activeView = EView.edit_project;
  }

  showingAddMember: boolean = false;
  showAddMember() {
    console.log("showing add memebers");
    this.loginService.getUsers()
      .subscribe(
      users => {
        this.allUsers = users.data;
      },
      err => {
        console.log("Retrieveing of users failed");
        this.showError("Retrieveing of users failed");
      }
      )
    this.showingAddMember = true;
  }

  closeAddMember() {
    this.showingAddMember = false;
  }

  onAddMember(email: string) {
    console.log("adding member: ", email);
    this.activeMembers.push(email);
  }

  onRemoveMember(i: number) {
    this.activeMembers.splice(i, 1);
  }

  onSaveProject({value, valid}: { value: IGeneralProject, valid: boolean }) {
    console.log("saving project");
    let project = value;
    project.members = this.activeMembers;

    if (this.activeProject) {
      this.dataService.updateProject(this.activeProject._id, project)
        .subscribe(
        updatedProject => {
          this.successMessage = "Success";
          this.showProjectList();
        },
        err => {
          this.showError(this.respMsgService.getUpdateFailed());
        }
        )
    } else {
      this.dataService.createProject(project)
        .subscribe(
        newProject => {
          console.log("New project: ", newProject);
          this.successMessage = "Success";
          this.showProjectList();
        },
        err => {
          this.showError(this.respMsgService.getCreateProjectFailed());
        }
        )
    }
  }

  initTaskForm(): FormGroup {
    console.log("initializing task form group");
    return this.fb.group({
      taskName: [''],
      taskDescription: [''],
      taskOwner: [''],
      dueDate: []
    });
  }

  initMMForm() {
    console.log("initializing mm form");
    this.mmForm = this.fb.group({
      notes: [''],
      tasks: this.fb.array([
        this.initTaskForm(),
      ])
    });
  }

  isMMList() {
    // console.log("mmSubView===EMMSubView.list: ", this.mmSubView === EMMSubView.list);
    return this.mmSubView === EMMSubView.list;
  }

  isMMRead() {
    // console.log("mmSubView===EMMSubView.read: ", this.mmSubView === EMMSubView.read);
    return this.mmSubView === EMMSubView.read;
  }

  isMMAdd() {
    // console.log("mmSubView===EMMSubView.add: ", this.mmSubView === EMMSubView.add);
    return this.mmSubView === EMMSubView.add;
  }

  showReadMeetingMinutes(mm: IMeetingMinutes) {
    console.log("Showing meeting minutes", mm);
    this.activeMM = mm;
    this.mmSubView = EMMSubView.read;
  }

  closeReadMeetingMinutes() {
    this.activeMM = null;
    this.mmSubView = EMMSubView.list;
  }

  showAddMeetingMinutes() {
    console.log("Adding meeting minutes");
    this.initMMForm();
    this.mmSubView = EMMSubView.add;
  }

  closeAddMeetingMinutes() {
    this.activeMM = null;
    this.mmSubView = EMMSubView.list;
  }

  onAddTask() {
    console.log("this.mmForm.controls['tasks']: ", this.mmForm.controls['tasks']);
    const taskFormControl = <FormArray>this.mmForm.controls['tasks'];
    console.log("taskFormControl: ", taskFormControl);
    taskFormControl.push(this.initTaskForm());
  }

  onRemoveTask(i: number) {
    console.log("removing task: ", i);
    const taskFormControl = <FormArray>this.mmForm.controls['tasks'];
    taskFormControl.removeAt(i);
  }

  onSaveMeetingMinutes({value, valid}: { value: IMeetingMinutes, valid: boolean }) {
    console.log("saving meeting minutes: ", value);
    this.dataService.addMeetingMinutes(this.activeProject._id, value)
      .subscribe(
      resp => {
        console.log("adding mm response: ", resp);
        this.successMessage = "Added succefully";
        this.activeProject.meetingMinutes.push(value);
        this.closeAddMeetingMinutes();
      },
      err => this.showError("Adding failed")
      );
  }

  canAddMM() {
    if (this.activeProject.owner == this.activeUser.email) {
      return true;
    } else if (this.activeProject.members.indexOf(this.activeUser.email) !== -1) {
      return true;
    }
    return false;
  }

  logOut() {
    console.log("logging out ...");
    localStorage.clear();
    this.isLoggedIn = false;
    this.activeUser = null;
    this.activeLoginTab = ELoginTab.login;
    this.cssLoginTab = "active-tab";
    this.cssSignupTab = "";
    this.activeView = EView.login;
  }

  getProjectUsers() {
    let users = Array<string>();
    users.push(this.activeProject.owner);
    this.activeProject.members.forEach(member => {
      users.push(member);
    });

    return users;
  }

  showError(errMsg: string) {
    this.errorMessage = errMsg;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }
}
