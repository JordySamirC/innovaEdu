import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';

    constructor(private http: HttpClient) { }

    async login(email: string, password: string): Promise<{ token: string; username: string }> {
        const response = await firstValueFrom(
            this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
        );
        const token = response.token;
        localStorage.setItem('jwt', token);
        // Get user data
        try {
            const user = await this.getCurrentUser();
            const username = user.username;
            localStorage.setItem('username', username);
            console.log('Username saved:', username);
            return { token, username };
        } catch (error) {
            console.error('Error getting user:', error);
            localStorage.setItem('username', email); // Fallback to email
            return { token, username: email };
        }
    }

    async getCurrentUser(): Promise<any> {
        const headers = { Authorization: `Bearer ${this.getToken()}` };
        return firstValueFrom(this.http.get('/api/users/me', { headers }));
    }

    async register(username: string, email: string, password: string): Promise<void> {
        await firstValueFrom(
            this.http.post(`${this.apiUrl}/register`, { username, email, password }, { responseType: 'text' })
        );
    }

    logout() {
        localStorage.removeItem('jwt');
    }

    getToken(): string | null {
        return localStorage.getItem('jwt');
    }

    getRole(): string | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (e) {
            return null;
        }
    }

    getEmail(): string | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub; // subject is email
        } catch (e) {
            return null;
        }
    }

    getUsername(): string | null {
        return localStorage.getItem('username');
    }
}
