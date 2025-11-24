import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

interface MaterialResponse {
  id: number;
  type: string;
  content: string;
  grade: string;
  subject: string;
  topic: string;
}



@Component({
  selector: 'app-teacher-dashboard-generation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-dashboard-generation.component.html',
  styleUrls: ['./teacher-dashboard-generation.component.scss']
})
export class TeacherDashboardGenerationComponent implements OnInit, OnDestroy {
  generationForm: FormGroup;
  generatedMaterial: MaterialResponse | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private title: Title,
    private meta: Meta,
    private cdr: ChangeDetectorRef
  ) {
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

  ngOnDestroy() {
    // Limpiar el contenido generado al salir del componente
    this.generatedMaterial = null;
    this.isLoading = false;
  }

  async generateMaterial() {
    if (this.generationForm.valid) {
      console.log('🚀 Iniciando generación...');
      this.isLoading = true;

      // Simular delay de generación
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const formData = this.generationForm.value;
        console.log('📝 Datos del formulario:', formData);

        const content = this.generateContent(
          formData.materialType,
          formData.grade,
          formData.subject,
          formData.topic
        );

        console.log('✅ Contenido generado, longitud:', content.length);

        this.generatedMaterial = {
          id: Date.now(),
          type: formData.materialType,
          content: content,
          grade: formData.grade,
          subject: formData.subject,
          topic: formData.topic
        };

        console.log('✅ Material asignado:', this.generatedMaterial);
      } catch (error) {
        console.error('❌ Error generating material:', error);
        alert('Hubo un error al generar el material. Por favor, intenta nuevamente.');
      } finally {
        console.log('🏁 Finalizando generación, isLoading = false');
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
      }
    } else {
      console.warn('⚠️ Formulario inválido');
    }
  }

  private generateContent(type: string, grade: string, subject: string, topic: string): string {
    const gradeText = `${grade}° Grado`;

    switch (type) {
      case 'Sesión de Aprendizaje':
        return this.generateSessionPlan(gradeText, subject, topic);
      case 'Ficha Práctica':
        return this.generateWorksheet(gradeText, subject, topic);
      case 'Rúbrica':
        return this.generateRubric(gradeText, subject, topic);
      case 'Unidad de Aprendizaje':
        return this.generateLearningUnit(gradeText, subject, topic);
      default:
        return 'Material generado exitosamente.';
    }
  }

  private generateSessionPlan(grade: string, subject: string, topic: string): string {
    return `SESIÓN DE APRENDIZAJE

DATOS INFORMATIVOS:
- Grado: ${grade}
- Área: ${subject}
- Tema: ${topic}
- Duración: 90 minutos

I. PROPÓSITOS DE APRENDIZAJE:

Competencia:
- Resuelve problemas relacionados con ${topic} en ${subject}

Capacidades:
- Comprende los conceptos fundamentales de ${topic}
- Aplica estrategias para resolver problemas de ${topic}
- Argumenta sus procedimientos y resultados

Desempeños:
- Identifica y describe las características de ${topic}
- Resuelve ejercicios prácticos aplicando ${topic}
- Explica el proceso seguido para resolver problemas

II. SECUENCIA DIDÁCTICA:

INICIO (20 minutos):
- Motivación: Presentación de situación problemática cotidiana relacionada con ${topic}
- Saberes previos: ¿Qué saben sobre ${topic}? ¿Dónde lo han visto?
- Conflicto cognitivo: ¿Cómo podemos resolver este problema?
- Propósito: Hoy aprenderemos sobre ${topic} y cómo aplicarlo

DESARROLLO (50 minutos):
- Presentación del tema ${topic} con ejemplos visuales
- Explicación paso a paso de los conceptos clave
- Práctica guiada: Resolución de ejercicios en grupo
- Trabajo individual: Ejercicios de aplicación
- Retroalimentación continua

CIERRE (20 minutos):
- Metacognición: ¿Qué aprendimos? ¿Cómo lo aprendimos? ¿Para qué nos sirve?
- Evaluación formativa: Preguntas de verificación
- Tarea para casa: Ejercicios de refuerzo

III. MATERIALES Y RECURSOS:
- Pizarra y plumones
- Fichas de trabajo
- Material concreto (si aplica)
- Cuadernos de trabajo

IV. EVALUACIÓN:
- Instrumento: Lista de cotejo / Rúbrica
- Criterios: Comprensión, aplicación y argumentación`;
  }

  private generateWorksheet(grade: string, subject: string, topic: string): string {
    const topicLower = topic.toLowerCase();
    let problems = '';

    // Generar problemas específicos según el tema
    if (subject === 'Matemáticas') {
      if (topicLower.includes('suma') || topicLower.includes('adición')) {
        problems = `
   Problema 1: María tiene 5 manzanas y su mamá le da 3 más. ¿Cuántas manzanas tiene ahora?
   5 + 3 = _____

   Problema 2: En el salón hay 8 niños y llegan 4 más. ¿Cuántos niños hay en total?
   8 + 4 = _____

   Problema 3: Pedro juntó 6 carritos y su hermano le regaló 7. ¿Cuántos carritos tiene Pedro?
   6 + 7 = _____

   Problema 4: Ana compró 9 lápices y su papá le compró 5 más. ¿Cuántos lápices tiene en total?
   9 + 5 = _____`;
      } else if (topicLower.includes('resta') || topicLower.includes('sustracción')) {
        problems = `
   Problema 1: Juan tenía 12 caramelos y regaló 5. ¿Cuántos caramelos le quedan?
   12 - 5 = _____

   Problema 2: En la caja había 15 galletas y se comieron 8. ¿Cuántas galletas quedan?
   15 - 8 = _____

   Problema 3: María tenía 20 soles y gastó 12. ¿Cuánto dinero le queda?
   20 - 12 = _____

   Problema 4: En el árbol había 18 pájaros y volaron 9. ¿Cuántos pájaros quedaron?
   18 - 9 = _____`;
      } else if (topicLower.includes('multiplicación') || topicLower.includes('tablas')) {
        problems = `
   Problema 1: Si cada caja tiene 4 manzanas y hay 3 cajas, ¿cuántas manzanas hay en total?
   4 × 3 = _____

   Problema 2: María compra 5 paquetes de galletas. Cada paquete tiene 6 galletas. ¿Cuántas galletas compró?
   5 × 6 = _____

   Problema 3: En cada mesa hay 8 sillas y hay 4 mesas. ¿Cuántas sillas hay en total?
   8 × 4 = _____

   Problema 4: Pedro lee 7 páginas cada día. ¿Cuántas páginas lee en 5 días?
   7 × 5 = _____`;
      } else {
        problems = `
   Problema 1: Resuelve el siguiente ejercicio sobre ${topic}:
   [Espacio para resolver]

   Problema 2: Aplica ${topic} en esta situación:
   [Espacio para resolver]

   Problema 3: Calcula usando ${topic}:
   [Espacio para resolver]

   Problema 4: Resuelve este problema de ${topic}:
   [Espacio para resolver]`;
      }
    } else {
      problems = `
   Problema 1: Analiza y responde sobre ${topic}:
   [Espacio para resolver]

   Problema 2: Explica cómo se relaciona ${topic} con tu vida diaria:
   [Espacio para resolver]

   Problema 3: Investiga y describe un aspecto importante de ${topic}:
   [Espacio para resolver]

   Problema 4: Crea un ejemplo propio sobre ${topic}:
   [Espacio para resolver]`;
    }

    return `FICHA PRÁCTICA - ${subject.toUpperCase()}

Grado: ${grade}
Tema: ${topic}

Nombre: _________________________________  Fecha: __________

INSTRUCCIONES: Lee atentamente cada ejercicio y resuelve en los espacios indicados.

I. CONCEPTOS BÁSICOS (4 puntos)

1. Define con tus propias palabras qué es ${topic}:
   _______________________________________________________________
   _______________________________________________________________

2. Menciona tres ejemplos donde se aplica ${topic} en la vida diaria:
   a) ___________________________________________________________
   b) ___________________________________________________________
   c) ___________________________________________________________

II. EJERCICIOS DE APLICACIÓN (8 puntos)

3. Resuelve los siguientes problemas sobre ${topic}:
${problems}

III. PROBLEMAS DE RAZONAMIENTO (8 puntos)

4. Situación problemática:
   ${this.generateContextualProblem(subject, topic, grade)}
   
   a) ¿Qué datos tienes?
   b) ¿Qué te piden encontrar?
   c) Resuelve paso a paso
   d) Verifica tu respuesta

AUTOEVALUACIÓN:
¿Qué aprendí hoy? _____________________________________________
¿Qué dificultades tuve? ________________________________________
¿Cómo las superé? _____________________________________________`;
  }

  private generateContextualProblem(subject: string, topic: string, grade: string): string {
    const topicLower = topic.toLowerCase();

    if (subject === 'Matemáticas') {
      if (topicLower.includes('suma')) {
        return `En la tienda escolar, Luis compró 3 cuadernos, 5 lápices y 2 borradores.
   Su amiga Ana compró 4 cuadernos, 3 lápices y 1 borrador.
   ¿Cuántos útiles escolares compraron entre los dos?`;
      } else if (topicLower.includes('resta')) {
        return `La mamá de Pedro tenía 25 soles. Compró pan por 8 soles y leche por 6 soles.
   ¿Cuánto dinero le sobró?`;
      } else {
        return `Plantea y resuelve un problema de la vida real que involucre ${topic}.`;
      }
    } else if (subject === 'Lenguaje') {
      return `Escribe un texto corto (5 líneas) donde uses correctamente ${topic}.
   Luego, subraya los ejemplos que encuentres.`;
    } else {
      return `Describe una situación de tu comunidad donde se observe ${topic}.
   Explica por qué es importante y qué aprendiste.`;
    }
  }

  private generateRubric(grade: string, subject: string, topic: string): string {
    return `RÚBRICA DE EVALUACIÓN

Área: ${subject}
Grado: ${grade}
Tema: ${topic}

CRITERIOS DE EVALUACIÓN:

┌─────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ CRITERIO            │ EXCELENTE(4) │ BUENO (3)    │ REGULAR (2)  │ DEFICIENTE(1)│
├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Comprensión del     │ Demuestra    │ Demuestra    │ Demuestra    │ No demuestra │
│ tema ${topic}       │ comprensión  │ comprensión  │ comprensión  │ comprensión  │
│                     │ profunda y   │ adecuada del │ básica del   │ del tema     │
│                     │ completa     │ tema         │ tema         │              │
├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Aplicación de       │ Aplica       │ Aplica       │ Aplica con   │ No logra     │
│ conceptos           │ correcta y   │ correcta-    │ errores los  │ aplicar los  │
│                     │ creativamente│ mente los    │ conceptos    │ conceptos    │
│                     │ los conceptos│ conceptos    │              │              │
├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Procedimientos      │ Usa procedi- │ Usa procedi- │ Usa procedi- │ No usa       │
│ y estrategias       │ mientos      │ mientos      │ mientos con  │ procedimien- │
│                     │ eficientes   │ adecuados    │ dificultad   │ tos correctos│
├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Argumentación       │ Explica      │ Explica      │ Explica      │ No explica   │
│ y comunicación      │ claramente   │ adecuada-    │ con          │ sus          │
│                     │ sus procesos │ mente sus    │ dificultad   │ procedimien- │
│                     │              │ procesos     │              │ tos          │
├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Presentación        │ Trabajo      │ Trabajo      │ Trabajo poco │ Trabajo      │
│ del trabajo         │ ordenado,    │ ordenado y   │ ordenado     │ desordenado  │
│                     │ limpio y     │ legible      │              │              │
│                     │ creativo     │              │              │              │
└─────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

PUNTAJE TOTAL: _____ / 20 puntos

NIVEL DE LOGRO:
- Logro destacado (18-20): AD
- Logro esperado (14-17): A
- En proceso (11-13): B
- En inicio (0-10): C

OBSERVACIONES Y RECOMENDACIONES:
_________________________________________________________________
_________________________________________________________________`;
  }

  private generateLearningUnit(grade: string, subject: string, topic: string): string {
    return `UNIDAD DE APRENDIZAJE

I. DATOS INFORMATIVOS:
- Área: ${subject}
- Grado: ${grade}
- Título: "${topic}"
- Duración: 4 semanas (20 horas pedagógicas)

II. SITUACIÓN SIGNIFICATIVA:
Los estudiantes de ${grade} necesitan comprender ${topic} para aplicarlo en situaciones cotidianas y desarrollar su pensamiento crítico en ${subject}.

III. PROPÓSITOS DE APRENDIZAJE:

Competencias:
1. Resuelve problemas relacionados con ${topic}
2. Gestiona su aprendizaje de manera autónoma

Capacidades:
- Comprende conceptos de ${topic}
- Aplica estrategias de resolución
- Argumenta y comunica sus ideas
- Reflexiona sobre su proceso de aprendizaje

IV. SECUENCIA DE SESIONES:

SEMANA 1: Introducción a ${topic}
- Sesión 1: Conceptos básicos y definiciones
- Sesión 2: Ejemplos y aplicaciones iniciales
- Sesión 3: Práctica guiada
- Sesión 4: Evaluación formativa

SEMANA 2: Desarrollo y profundización
- Sesión 5: Estrategias de resolución
- Sesión 6: Problemas de aplicación
- Sesión 7: Trabajo colaborativo
- Sesión 8: Retroalimentación

SEMANA 3: Aplicación práctica
- Sesión 9: Proyectos de aplicación
- Sesión 10: Presentaciones grupales
- Sesión 11: Análisis de casos
- Sesión 12: Evaluación de proceso

SEMANA 4: Consolidación y evaluación
- Sesión 13: Repaso general
- Sesión 14: Resolución de problemas complejos
- Sesión 15: Evaluación final
- Sesión 16: Metacognición y cierre

V. MATERIALES Y RECURSOS:
- Textos escolares
- Fichas de trabajo
- Material concreto
- Recursos digitales
- Plataformas educativas

VI. EVALUACIÓN:
- Evaluación diagnóstica (inicio)
- Evaluación formativa (continua)
- Evaluación sumativa (final)
- Instrumentos: Rúbricas, listas de cotejo, pruebas escritas

VII. REFERENCIAS BIBLIOGRÁFICAS:
- Currículo Nacional de Educación Básica
- Textos de ${subject} - MINEDU
- Recursos pedagógicos complementarios`;
  }

  exportMaterial(format: string) {
    if (!this.generatedMaterial) return;

    const content = this.generatedMaterial.content;
    const filename = `${this.generatedMaterial.type.replace(/\s+/g, '_')}_${this.generatedMaterial.topic}_${this.generatedMaterial.grade}Grado`;

    if (format === 'pdf') {
      // Crear ventana de impresión con estilos A4 y sin headers/footers
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>${filename}</title>
              <style>
                @page {
                  size: A4;
                  margin: 2cm;
                }

                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                  }

                  /* Ocultar headers y footers del navegador */
                  @page {
                    margin-top: 0;
                    margin-bottom: 0;
                  }
                }

                body {
                  font-family: 'Arial', sans-serif;
                  padding: 20mm;
                  line-height: 1.6;
                  color: #000;
                  background: white;
                  max-width: 210mm;
                  margin: 0 auto;
                }

                pre {
                  white-space: pre-wrap;
                  font-family: 'Courier New', monospace;
                  font-size: 11pt;
                  margin: 0;
                  line-height: 1.5;
                }

                h1 {
                  text-align: center;
                  color: #2d3748;
                  margin-bottom: 20px;
                  font-size: 18pt;
                }
              </style>
            </head>
            <body>
              <pre>${content}</pre>
            </body>
          </html>
        `);
        printWindow.document.close();

        // Esperar a que cargue y luego imprimir
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            // No cerrar automáticamente para que el usuario pueda guardar
          }, 250);
        };
      }
    } else if (format === 'docx') {
      // Crear un documento HTML que Word puede abrir
      const htmlContent = `
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head>
          <meta charset='UTF-8'>
          <title>${filename}</title>
          <style>
            body {
              font-family: 'Calibri', 'Arial', sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              margin: 2cm;
            }
            pre {
              font-family: 'Courier New', monospace;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
        </html>
      `;

      // Crear blob con tipo MIME de Word
      const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.docx`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  }
}