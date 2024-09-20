import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService, User } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  async signIn() {
    console.log('Attempting sign-in');
    try {
      const { data, error } = await this.supabaseService.signIn(this.email, this.password);
      if (error) {
        alert('Invalid credentials');
        console.error('Sign-in error:', error);
        return;
      }

      // Fetch all users and filter by the email provided during sign-in
      const users: User[] = await this.supabaseService.getUsers();
      const user = users.find(u => u.email === this.email);
      
      if (user) {
        localStorage.setItem('userRole', user.role);
        if (user.role === 'user') {
          this.router.navigate(['/user/dashboard']);
        } else if (user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        }
      } else {
        alert('Role not found');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  }

  onSubmit() {
    this.signIn();
  }

  autoSignInUser() {
    this.email = 'user@gmail.com';
    this.password = 'password';
    this.signIn();
  }

  autoSignInAdmin() {
    this.email = 'admin@gmail.com';
    this.password = 'password';
    this.signIn();
  }
}