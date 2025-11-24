import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-teacher-dashboard-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header class="dashboard-header">
      <h1>Panel de Profesor</h1>
    </header>
  `,
    styles: [`
    .dashboard-header {
      padding: 1.5rem 2rem;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }
  `]
})
export class TeacherDashboardHeaderComponent {
}
