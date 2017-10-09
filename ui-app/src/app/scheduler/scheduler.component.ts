import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router }                       from "@angular/router";
import { SchedulerService }             from './scheduler.service';
import { ServerResponseCode }           from './response.code.constants';
import { Observable, Subscription }                     from 'rxjs/Rx';

@Component({
  template: require('./scheduler.component.html')
})

export class SchedulerComponent implements OnInit, OnDestroy { 
  schedulerForm: FormGroup;
  jobNameStatus : String;
  jobRecords = [];
  jobRefreshTimerSubscription: Subscription;

  isEditMode: boolean = false;

  constructor(private _router: Router,
    private _fb: FormBuilder,
    private _schedulerService : SchedulerService,
    private _responseCode : ServerResponseCode) {}

  ngOnInit() { 
    this.jobNameStatus = ""; 

    this.schedulerForm = this._fb.group({
      jobName: [''],
      year: [''],
      month: [''],
      day: [''],
      hour: [''],
      minute: [''],
      cronExpression: ['0 0/1 * 1/1 * ? *']
    });
    this.setDate();
    this.getJobs();

    let timer = Observable.timer(2000,3000);
    this.jobRefreshTimerSubscription = timer.subscribe(t=>{
      this.getJobs();
    }); 
  }

  ngOnDestroy() {
    this.jobRefreshTimerSubscription.unsubscribe();
  }

  setDate(): void {
      let date = new Date();
      this.schedulerForm.patchValue({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes()
        });
  }

  resetForm(){
    var dateNow = new Date();
    this.schedulerForm.patchValue({
        jobName: "",
        year: dateNow.getFullYear(),
        month: dateNow.getMonth() + 1,
        day: dateNow.getDate(),
        hour: dateNow.getHours(),
        minute: dateNow.getMinutes()
      });
    this.jobNameStatus = "";
  }

  getJobs(){
    this._schedulerService.getJobs().subscribe(
      success => {
          if(success.statusCode == ServerResponseCode.SUCCESS){
            this.jobRecords = success.data;
          }else{
            alert("Some error while fetching jobs");
          }
          
          /*
          let dateToShow = new Date(success.scheduleTime);
          this.jobRecords.scheduleTime = this.getFormattedDate(dateToShow.getFullYear(), 
            dateToShow.getMonth(),dateToShow.getHours(), dateToShow.getHours(),
            dateToShow.getMinutes());
          */
      },
      err => {
        alert("Error while getting all jobs");
      });
  }

  getFormattedDate(year, month, day, hour, minute) {
    return year + "/" + month + "/" + day + " " + hour+":"+minute;
  }

  checkJobExistWith(jobName){
      var data = {
        "jobName": jobName
      }
      this._schedulerService.isJobWithNamePresent(data).subscribe(
      success => {
          if(success.statusCode == ServerResponseCode.SUCCESS){
            if(success.data == true){
              this.jobNameStatus = "Bad :(";
            }else{
              this.jobNameStatus = "Good :)";
            }
          }else if(success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT){
            alert("Job name is mandatory.");
            this.schedulerForm.patchValue({
              jobName: "",
            });
          }
      },
      err => {
        alert("Error while checkinh job with name exist.");
      });
      this.jobNameStatus = ""; 
  }

  scheduleJob(){
    var jobName = this.schedulerForm.value.jobName;
    var year = this.schedulerForm.value.year;
    var month = this.schedulerForm.value.month;
    var day = this.schedulerForm.value.day;
    var hour = this.schedulerForm.value.hour;
    var minute = this.schedulerForm.value.minute;
    
    var data = {
      "jobName": this.schedulerForm.value.jobName,
      "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
      "cronExpression": this.schedulerForm.value.cronExpression,
    }

    this._schedulerService.scheduleJob(data).subscribe(
      success => {
          if(success.statusCode == ServerResponseCode.SUCCESS){
            alert("Job scheduled successfully.");
            this.resetForm();

          }else if(success.statusCode == ServerResponseCode.JOB_WITH_SAME_NAME_EXIST){
            alert("Job with same name exists, Please choose different name.");
          
          }else if(success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT){
            alert("Job name is mandatory.");
          }
          this.jobRecords = success.data;
      },
      err => {
        alert("Error while getting all jobs");
      });
  }

  updateJob(){ 
    var jobName = this.schedulerForm.value.jobName;
    var year = this.schedulerForm.value.year;
    var month = this.schedulerForm.value.month;
    var day = this.schedulerForm.value.day;
    var hour = this.schedulerForm.value.hour;
    var minute = this.schedulerForm.value.minute;
    
    var data = {
      "jobName": this.schedulerForm.value.jobName,
      "jobScheduleTime": this.getFormattedDate(year, month, day, hour, minute),
      "cronExpression": this.schedulerForm.value.cronExpression
    }

    this._schedulerService.updateJob(data).subscribe(
      success => {
          if(success.statusCode == ServerResponseCode.SUCCESS){
            alert("Job updated successfully.");
            this.resetForm();

          }else if(success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST){
            alert("Job no longer exist.");
          
          }else if(success.statusCode == ServerResponseCode.JOB_NAME_NOT_PRESENT){
            alert("Please provide job name.");
          }
          this.jobRecords = success.data;
      },
      err => {
        alert("Error while updating job");
      });
  }

  editJob(selectedJobRow){
    this.isEditMode = true;

    var d = Date.parse(selectedJobRow.scheduleTime);
    let date = new Date(selectedJobRow.scheduleTime); 
    this.schedulerForm.patchValue({
        jobName: selectedJobRow.jobName,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
      });
  }

  cancelEdit(){
    this.resetForm();
    this.isEditMode = false;
  }

  pauseJob(jobName){
      var data = {
        "jobName": jobName
      }
      this._schedulerService.pauseJob(data).subscribe(
        success => {
          if(success.statusCode == ServerResponseCode.SUCCESS && success.data == true){
            alert("Job paused successfully.")
            
          }else if(success.data == false){
            if(success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE){
                alert("Job already started/completed, so cannot be paused.");
            }
          }
          this.getJobs();
        },
        err => {
          alert("Error while pausing job");
        });

      //For updating fresh status of all jobs 
      this.getJobs();
  }

  resumeJob(jobName){
      var data = {
        "jobName": jobName
      }
     this._schedulerService.resumeJob(data).subscribe(
      success => {
        if(success.statusCode == ServerResponseCode.SUCCESS && success.data == true){
            alert("Job resumed successfully.")
          
          }else if(success.data == false){
            if(success.statusCode == ServerResponseCode.JOB_NOT_IN_PAUSED_STATE){
                alert("Job is not in paused state, so cannot be resumed.");
            }
          }
          
          //For updating fresh status of all jobs 
          this.getJobs();
      },
      err => {
        alert("Error while resuming job");
      }); 
      
      //For updating fresh status of all jobs 
      this.getJobs();
  }

  stopJob(jobName){
      var data = {
        "jobName": jobName
      }
      this._schedulerService.stopJob(data).subscribe(
        success => {
          if(success.statusCode == ServerResponseCode.SUCCESS && success.data == true){
            alert("Job stopped successfully.")
            
          }else if(success.data == false){
            if(success.statusCode == ServerResponseCode.JOB_NOT_IN_RUNNING_STATE){
              alert("Job not started, so cannot be stopped.");

            }else if(success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE){
              alert("Job already started.");

            }else if(success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST){
              alert("Job no longer exist.");
            }
          }

          //For updating fresh status of all jobs 
          this.getJobs();
        },
        err => {
          alert("Error while pausing job");
        });
  }
  
  startJobNow(jobName){
      var data = {
        "jobName": jobName
      }
      this._schedulerService.startJobNow(data).subscribe(
        success => {
          if(success.statusCode == ServerResponseCode.SUCCESS && success.data == true){
            alert("Job started successfully.")
            
          }else if(success.data == false){
            if(success.statusCode == ServerResponseCode.ERROR){
                alert("Server error while starting job.");

            }else if(success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE){
              alert("Job is already started.");

            }else if(success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST){
              alert("Job no longer exist.");
            }
          }
          
          //For updating fresh status of all jobs 
          this.getJobs();
        },
        err => {
          alert("Error while starting job now.");
        });

      //For updating fresh status of all jobs 
      this.getJobs();
  }

  deleteJob(jobName){
    var data = {
      "jobName": jobName
    }
    this._schedulerService.deleteJob(data).subscribe(
      success => {
          if(success.statusCode == ServerResponseCode.SUCCESS && success.data == true){
            alert("Job deleted successfully.");
          
          }else if(success.data == false){
            if(success.statusCode == ServerResponseCode.JOB_ALREADY_IN_RUNNING_STATE){
                alert("Job is already started/completed, so cannot be deleted.");

            }else if(success.statusCode == ServerResponseCode.JOB_DOESNT_EXIST){
              alert("Job no longer exist.");
            }
          }

          //For updating fresh status of all jobs
          this.getJobs();
      },
      err => {
        alert("Error while deleting job");
      });
  }

  refreshJob(){
      //For updating fresh status of all jobs 
      this.getJobs();   
  }

  cronChange(cronExp){
    this.schedulerForm.patchValue({
        cronExpression: cronExp
      });
  }
}