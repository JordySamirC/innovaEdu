import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-teacher-dashboard-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './teacher-dashboard-header.component.html',
  styleUrls: ['./teacher-dashboard-header.component.scss']
})
export class TeacherDashboardHeaderComponent {
  activeTab: string = 'account';
  userName: string | null = null;
  userEmail: string | null = null;
  dropdownOpen: boolean = false;
  isEditModalOpen: boolean = false;
  editForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
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

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  openEditModal() {
    this.dropdownOpen = false; // Close dropdown
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
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