import { Routes, RouterModule } from '@angular/router';

import { SchedulerComponent } from './scheduler/scheduler.component';

export const appRoutes: Routes = [
    { 
        path: '', 
        component: SchedulerComponent, 
    }
];
