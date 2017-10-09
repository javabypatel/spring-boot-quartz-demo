import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { Routes, RouterModule }             from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule }                       from '@angular/http';
import { SchedulerComponent }               from './scheduler.component';
import { SchedulerRoutes }                  from './scheduler.routes';
import { SchedulerService }                 from './scheduler.service';
import { ServerResponseCode }               from './response.code.constants';
@NgModule({ 
    //put all your modules here
    //The imports key in the context of an @NgModule defines additional modules 
    //that will be imported into the current module
 
    imports: [ 
        CommonModule,
        SchedulerRoutes,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpModule
    ],

    // put all your components / directives / pipes here
    declarations:[
        SchedulerComponent
    ],

    // put all your services here
    providers: [
        SchedulerService,
        ServerResponseCode
    ],
})

export class SchedulerModule{}