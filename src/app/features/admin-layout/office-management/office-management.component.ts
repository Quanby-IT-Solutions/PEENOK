import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService, User, Office } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-office-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './office-management.component.html',
  styleUrls: ['./office-management.component.css']
})
export class OfficeManagementComponent implements OnInit {
  users: User[] = [];
  agencies: Office[] = [];
  pagedAgencies: Office[] = [];
  currentPage = 1;
  itemsPerPage = 10;  // Adjust as needed
  totalPages = 1;
  openSubmenuId: number | null = null;
  
  searchTerm: string = '';   // Holds the search query
  newAgencyName: string = ''; // Holds the new agency name

  notifications: { message: string, type: 'success' | 'error' }[] = [];

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notifications.push({ message, type });
    setTimeout(() => this.notifications.shift(), 3000); // Remove notification after 3 seconds
  }

  async ngOnInit(): Promise<void> {
    this.users = await this.supabaseService.getUsers();
    this.agencies = await this.supabaseService.getAgencies();
    this.totalPages = Math.ceil(this.agencies.length / this.itemsPerPage);
    this.updatePagedAgencies();
  }
  

  async loadAgencies(): Promise<void> {
    this.agencies = await this.supabaseService.getAgencies();
    this.totalPages = Math.ceil(this.agencies.length / this.itemsPerPage);
    this.updatePagedAgencies();
  }

  updatePagedAgencies(): void {
    const filteredAgencies = this.agencies.filter(agency =>
      agency.office_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedAgencies = filteredAgencies.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(filteredAgencies.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedAgencies();
  }

  toggleSubmenu(id: number): void {
    this.openSubmenuId = this.openSubmenuId === id ? null : id;
  }

  isSubmenuOpen(id: number): boolean {
    return this.openSubmenuId === id;
  }

  editAgency(id: number): void {
    // Navigate to the office-edit page with the given id
    this.router.navigate(['/admin/office-edit', id]);
  }

  async deleteAgency(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this agency?')) {
      const { error } = await this.supabaseService.deleteAgency(id);
      if (error) {
        console.error('Error deleting agency:', error);
        this.showNotification('Failed to delete office. Please try again.', 'error');
      } else {
        this.showNotification('Office deleted successfully.', 'success');
        // Reload agencies after deletion
        await this.loadAgencies();
      }
    }
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to the first page
    this.updatePagedAgencies();
  }

  async createAgency(): Promise<void> {
    if (this.newAgencyName.trim()) {
      const newAgency = { office_name: this.newAgencyName.trim() };
  
      const { error } = await this.supabaseService.createAgency(newAgency);
  
      if (error) {
        console.error('Error inserting new agency:', error);
        this.showNotification('Failed to create office. Please try again.', 'error');
      } else {
        await this.loadAgencies();
        this.newAgencyName = '';
        this.showNotification('Office created successfully.', 'success');
      }
    } else {
      this.showNotification('Agency name cannot be empty.', 'error');
    }
  }
}
