import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-teacher-dashboard-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <aside class="dashboard-sidebar">
      <nav>
        <a routerLink="/dashboard/teacher" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Inicio
        </a>
        <a routerLink="/dashboard/teacher/generation" routerLinkActive="active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          Generar Evaluación
        </a>
      </nav>
    </aside>
  `,
    styles: [`
    .dashboard-sidebar {
      width: 250px;
      background: #1f2937;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
    }

    nav {
      padding: 1rem 0;
    }

    nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      color: #9ca3af;
      text-decoration: none;
      transition: all 0.2s;
    }

    nav a:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }

    nav a.active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-left: 3px solid #3b82f6;
    }

    nav a svg {
      width: 20px;
      height: 20px;
    }
  `]
})
export class TeacherDashboardSidebarComponent {
}
