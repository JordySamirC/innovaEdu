import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-dashboard-sidebar.component.html',
  styleUrls: ['./teacher-dashboard-sidebar.component.scss']
})
export class TeacherDashboardSidebarComponent {
}