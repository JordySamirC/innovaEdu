import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    async onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }
        const { email, password } = this.loginForm.value;
        try {
            const token = await this.authService.login(email, password);
            localStorage.setItem('jwt', token);
            this.router.navigate(['/dashboard']);
        } catch (err: any) {
            this.errorMessage = err.error?.message || 'Error de autenticación';
        }
    }

    onGoogleLogin() {
        console.log('Google login clicked');
        // TODO: Implement Google Sign-In integration
    }
}
