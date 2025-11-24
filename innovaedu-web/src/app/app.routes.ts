import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard/teacher-dashboard.component';
import { TeacherDashboardHomeComponent } from './dashboard/teacher-dashboard/teacher-dashboard-home/teacher-dashboard-home.component';
import { TeacherDashboardGenerationComponent } from './dashboard/teacher-dashboard/teacher-dashboard-generation/teacher-dashboard-generation.component';
import { TeacherDashboardTrainingComponent } from './dashboard/teacher-dashboard/teacher-dashboard-training/teacher-dashboard-training.component';
import { TeacherDashboardCollaborationComponent } from './dashboard/teacher-dashboard/teacher-dashboard-collaboration/teacher-dashboard-collaboration.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {
                path: 'teacher',
                component: TeacherDashboardComponent,
                children: [
                    { path: '', component: TeacherDashboardHomeComponent },
                    { path: 'generation', component: TeacherDashboardGenerationComponent },
                    { path: 'training', component: TeacherDashboardTrainingComponent },
                    { path: 'collaboration', component: TeacherDashboardCollaborationComponent }
                ]
            },
            { path: 'admin', component: AdminDashboardComponent },
            { path: '', redirectTo: 'teacher', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: '' }
];
