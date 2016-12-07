import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from './services/data.service';
import { LoginService } from './services/login.service';
import { RespMsgService } from './services/resp-msg.service';
import { DatePickerModule } from 'ng2-datepicker';
import { TruncatePipe } from './app.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TruncatePipe,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    NgbModule.forRoot(),
    DatePickerModule
  ],
  providers: [
    DataService,
    LoginService,
    RespMsgService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
