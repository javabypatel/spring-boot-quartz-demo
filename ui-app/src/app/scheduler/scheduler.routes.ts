import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SchedulerComponent } from './scheduler.component';

const routes: Routes = [
    { 
        path: '',  
        component: SchedulerComponent 
    }
];
export const SchedulerRoutes: ModuleWithProviders = RouterModule.forChild(routes);