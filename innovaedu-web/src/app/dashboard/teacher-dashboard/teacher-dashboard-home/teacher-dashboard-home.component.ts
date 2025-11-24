import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-teacher-dashboard-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './teacher-dashboard-home.component.html',
    styleUrls: ['./teacher-dashboard-home.component.scss']
})
export class TeacherDashboardHomeComponent {
    // Datos de ejemplo para el dashboard
    stats = {
        totalEvaluations: 24,
        activeStudents: 156,
        pendingGrades: 8,
        averageScore: 85
    };

    recentEvaluations = [
        {
            id: 1,
            title: 'Evaluación de Matemáticas - Álgebra',
            date: new Date('2024-11-20'),
            students: 32,
            status: 'Completada'
        },
        {
            id: 2,
            title: 'Quiz de Geometría',
            date: new Date('2024-11-18'),
            students: 28,
            status: 'En progreso'
        },
        {
            id: 3,
            title: 'Examen Final - Trigonometría',
            date: new Date('2024-11-15'),
            students: 30,
            status: 'Completada'
        }
    ];

    quickActions = [
        {
            icon: 'add',
            title: 'Nueva Evaluación',
            description: 'Crear una evaluación con IA',
            route: '/dashboard/teacher/generation',
            color: '#3b82f6'
        },
        {
            icon: 'people',
            title: 'Ver Estudiantes',
            description: 'Gestionar estudiantes',
            route: '/dashboard/teacher/students',
            color: '#10b981'
        },
        {
            icon: 'analytics',
            title: 'Reportes',
            description: 'Ver estadísticas y análisis',
            route: '/dashboard/teacher/reports',
            color: '#f59e0b'
        },
        {
            icon: 'settings',
            title: 'Configuración',
            description: 'Ajustes de cuenta',
            route: '/dashboard/teacher/settings',
            color: '#6b7280'
        }
    ];
}
