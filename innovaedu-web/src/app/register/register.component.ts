import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { 'passwordMismatch': true };
        }
        return null;
    }

    async onSubmit() {
        if (this.registerForm.invalid) {
            return;
        }
        const { username, email, password } = this.registerForm.value;
        try {
            console.log('Enviando registro...');
            await this.authService.register(username, email, password);
            console.log('Registro exitoso');
            this.successMessage = '¡Registro exitoso! Redirigiendo al inicio de sesión...';
            setTimeout(() => {
                console.log('Redirigiendo a login');
                this.router.navigate(['/login']).then(() => {
                    console.log('Navegación completada');
                }).catch(err => {
                    console.error('Error en navegación:', err);
                });
            }, 2000);
        } catch (err: any) {
            console.error('Error en registro:', err);
            this.errorMessage = err.error?.message || 'Error en el registro';
        }
    }

    onGoogleLogin() {
        console.log('Google login clicked');
        // TODO: Implement Google Sign-In integration
    }
}