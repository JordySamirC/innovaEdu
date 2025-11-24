import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-teacher-dashboard-generation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-dashboard-generation.component.html',
  styleUrls: ['./teacher-dashboard-generation.component.scss']
})
export class TeacherDashboardGenerationComponent implements OnInit {
  generationForm: FormGroup;
  generatedMaterial: string | null = null;

  constructor(private fb: FormBuilder, private title: Title, private meta: Meta) {
    this.generationForm = this.fb.group({
      grade: ['', Validators.required],
      subject: ['', Validators.required],
      materialType: ['', Validators.required],
      topic: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.title.setTitle('Generación de Materiales Pedagógicos - InnovaEdu');
    this.meta.updateTag({ name: 'description', content: 'Crea materiales educativos personalizados alineados al CNEB con herramientas de IA.' });
  }

  generateMaterial() {
    if (this.generationForm.valid) {
      // Simular generación de material
      this.generatedMaterial = `Material generado para ${this.generationForm.value.grade}° grado, asignatura ${this.generationForm.value.subject}, tipo ${this.generationForm.value.materialType}, tema: ${this.generationForm.value.topic}.`;
    }
  }
}