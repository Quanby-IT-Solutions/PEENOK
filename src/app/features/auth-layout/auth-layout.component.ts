// src/app/features/auth-layout/auth-layout.component.ts
import { Component } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css'],
  imports: [LoginFormComponent],  // Import the LoginFormComponent here
})
export class AuthLayoutComponent {
  // Component logic here
}
