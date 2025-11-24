import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent {
  activeTab: string = 'generation';
  generationForm: FormGroup;
  generatedMaterial: string | null = null;
  userName: string | null = null;
  userEmail: string | null = null;
  dropdownOpen: boolean = false;
  isEditModalOpen: boolean = false;
  editForm: FormGroup;

  tutorials = [
    { title: 'Introducción a Herramientas Digitales', description: 'Aprende a usar plataformas en línea para clases virtuales.', link: '#' },
    { title: 'Creación de Rúbricas Interactivas', description: 'Guía para evaluar trabajos de estudiantes de forma efectiva.', link: '#' },
    { title: 'Microcurso: Gamificación en el Aula', description: 'Incorpora juegos para motivar el aprendizaje.', link: '#' }
  ];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.generationForm = this.fb.group({
      grade: ['', Validators.required],
      subject: ['', Validators.required],
      materialType: ['', Validators.required],
      topic: ['', Validators.required]
    });
    this.editForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^(\+51)?[0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      nivelEducativo: ['', Validators.required],
      asignatura: ['', Validators.required],
      newPassword: ['', [Validators.minLength(8)]]
    });
    this.userName = this.authService.getUsername() || 'Usuario';
    this.userEmail = this.authService.getEmail() || 'usuario@ejemplo.com';
    // Pre-fill email and other fields if available
    if (this.userEmail) {
      this.editForm.patchValue({ email: this.userEmail });
    }
    // TODO: Add pre-fill for nombres, apellidos, telefono, nivelEducativo, asignatura from AuthService
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  generateMaterial() {
    if (this.generationForm.valid) {
      const { grade, subject, materialType, topic } = this.generationForm.value;
      // Mock generation
      this.generatedMaterial = `Material generado: ${materialType} para grado ${grade}, área ${subject}, tema: ${topic}. Contenido alineado al CNEB. [Aquí iría el material real generado por IA o lógica.]`;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  openEditModal() {
    this.dropdownOpen = false; // Close dropdown
    this.isEditModalOpen = true;
    this.activeTab = 'account';
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.activeTab = 'account';
  }

  saveChanges() {
    if (this.editForm.valid) {
      // TODO: Implement save logic
      alert('Cambios guardados (simulado)');
      this.closeEditModal();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}