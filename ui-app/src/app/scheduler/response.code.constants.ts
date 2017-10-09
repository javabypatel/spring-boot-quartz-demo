import { Injectable } from '@angular/core';


@Injectable()
export class ServerResponseCode {
    //SPECIFIC ERROR CODES
	static JOB_WITH_SAME_NAME_EXIST = 501;
	static JOB_NAME_NOT_PRESENT = 502;
	
	static JOB_ALREADY_IN_RUNNING_STATE = 510;
	
	static JOB_NOT_IN_PAUSED_STATE = 520;
	static JOB_NOT_IN_RUNNING_STATE = 521;
	
	static JOB_DOESNT_EXIST = 500;
	
	//GENERIC ERROR
	static ERROR = 600;
	
	//SUCCESS CODES
	static SUCCESS = 200;
}