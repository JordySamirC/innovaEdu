import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-dashboard-generation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-dashboard-generation.component.html',
  styleUrls: ['./teacher-dashboard-generation.component.scss']
})
export class TeacherDashboardGenerationComponent {
  generationForm: FormGroup;
  generatedMaterial: string | null = null;

  constructor(private fb: FormBuilder) {
    this.generationForm = this.fb.group({
      grade: ['', Validators.required],
      subject: ['', Validators.required],
      materialType: ['', Validators.required],
      topic: ['', Validators.required]
    });
  }

  generateMaterial() {
    if (this.generationForm.valid) {
      // Simular generación de material
      this.generatedMaterial = `Material generado para ${this.generationForm.value.grade}° grado, asignatura ${this.generationForm.value.subject}, tipo ${this.generationForm.value.materialType}, tema: ${this.generationForm.value.topic}.`;
    }
  }
}