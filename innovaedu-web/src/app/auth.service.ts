import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';

    constructor(private http: HttpClient) { }

    async login(email: string, password: string): Promise<string> {
        const response = await firstValueFrom(
            this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
        );
        return response.token;
    }

    logout() {
        localStorage.removeItem('jwt');
    }

    getToken(): string | null {
        return localStorage.getItem('jwt');
    }
}
