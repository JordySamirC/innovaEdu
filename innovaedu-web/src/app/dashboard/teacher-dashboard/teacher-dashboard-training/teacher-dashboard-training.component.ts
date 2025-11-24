import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-dashboard-training',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard-training.component.html',
  styleUrls: ['./teacher-dashboard-training.component.scss']
})
export class TeacherDashboardTrainingComponent {
  tutorials = [
    { title: 'Introducción a Herramientas Digitales', description: 'Aprende a usar plataformas en línea para clases virtuales.', link: '#' },
    { title: 'Creación de Rúbricas Interactivas', description: 'Guía para evaluar trabajos de estudiantes de forma efectiva.', link: '#' },
    { title: 'Microcurso: Gamificación en el Aula', description: 'Incorpora juegos para motivar el aprendizaje.', link: '#' }
  ];
}