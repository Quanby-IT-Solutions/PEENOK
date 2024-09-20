import { Component, OnInit } from '@angular/core';
import { SupabaseService, User } from '../../../core/services/supabase.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedUsers: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  visibleSubMenuUserId: number | null = null;

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.fetchUsers(); // Use fetchUsers to load users on initialization
  }

  async fetchUsers(): Promise<void> {
    const users = await this.supabaseService.getUsers();  // Fetch users instead of documents
    if (users.length) {
      this.users = users;
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      this.updateDisplayedUsers();
    }
  }

  updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedUsers();
  }

  toggleSubMenu(userId: number): void {
    this.visibleSubMenuUserId = this.visibleSubMenuUserId === userId ? null : userId;
  }

  isSubMenuVisible(userId: number): boolean {
    return this.visibleSubMenuUserId === userId;
  }

  deactivateUser(user: User): void {
    const index = this.users.findIndex(u => u.account_id === user.account_id);
    if (index !== -1) {
      this.users[index].account_status = 'Inactive';
      this.updateDisplayedUsers();
    }
  }

  activateUser(user: User): void {
    const index = this.users.findIndex(u => u.account_id === user.account_id);
    if (index !== -1) {
      this.users[index].account_status = 'Active';
      this.updateDisplayedUsers();
    }
  }

  deleteUser(user: User): void {
    this.users = this.users.filter(u => u.account_id !== user.account_id);
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.updateDisplayedUsers();
  }

  createUser(param: string): void {
    this.router.navigate(['/admin/create-user']);
  }
}
