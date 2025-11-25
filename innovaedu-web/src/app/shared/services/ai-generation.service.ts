import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MaterialGenerationRequest {
    type: string;
    grade: string;
    subject: string;
    topic: string;
}

export interface MaterialResponse {
    id: number;
    type: string;
    content: string;
    grade: string;
    subject: string;
    topic: string;
}

@Injectable({
    providedIn: 'root'
})
export class AiGenerationService {
    private apiUrl = 'http://localhost:8080/api/materials';

    constructor(private http: HttpClient) { }

    generateMaterial(request: MaterialGenerationRequest): Observable<MaterialResponse> {
        const token = localStorage.getItem('jwt');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        // El backend ya tiene la integración con Hugging Face configurada correctamente
        // con el modelo Mistral-7B-Instruct que funciona mejor para español
        return this.http.post<MaterialResponse>(`${this.apiUrl}/generate`, request, { headers });
    }

    exportPDF(materialId: number): Observable<Blob> {
        const token = localStorage.getItem('jwt');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/${materialId}/export/pdf`, {
            headers,
            responseType: 'blob'
        });
    }

    exportDOCX(materialId: number): Observable<Blob> {
        const token = localStorage.getItem('jwt');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/${materialId}/export/docx`, {
            headers,
            responseType: 'blob'
        });
    }
}
