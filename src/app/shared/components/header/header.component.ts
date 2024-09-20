import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service'; // Import your Supabase service

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent implements OnInit {
  userName: string | null = 'John Doe'; // Mock username
  profileImageUrl: string = 'assets/profile/user-profile.jpg'; // Default profile image

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  async ngOnInit() {
    // Mock data, no need to fetch from Supabase
    // const user = await this.supabaseService.getCurrentUser();
    // if (user) {
    //   this.userName = user.email;
    // }
  }

  navigateToProfile() {
    this.router.navigate(['/admin/a-profile']);
  }
}