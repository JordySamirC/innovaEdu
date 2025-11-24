import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherDashboardHeaderComponent } from './teacher-dashboard-header/teacher-dashboard-header.component';
import { TeacherDashboardSidebarComponent } from './teacher-dashboard-sidebar/teacher-dashboard-sidebar.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TeacherDashboardHeaderComponent, TeacherDashboardSidebarComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent {
}