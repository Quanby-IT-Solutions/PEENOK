import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService, Office } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-office-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './office-edit.component.html',
  styleUrls: ['./office-edit.component.css']
})
export class OfficeEditComponent implements OnInit {
  agencyName: string = '';  // Holds the agency name for editing
  agencyId: string | null = null;  // Holds the ID of the agency being edited

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit(): Promise<void> {
    // Retrieve the agency ID from the route parameters
    this.agencyId = this.route.snapshot.paramMap.get('id');  // Use as string
    console.log('Agency ID from route:', this.agencyId);  // Log the ID
    
    // Check if agency ID is valid
    if (!this.agencyId) {
      alert('Invalid Agency ID');
      this.router.navigate(['/admin/office-management']);
      return;
    }
  
    // Fetch the current agency details
    const agency = await this.supabaseService.getAgencyById(this.agencyId);
    console.log('Fetched agency:', agency);  // Log the fetched agency data
  
    if (agency) {
      this.agencyName = agency.office_name;
    } else {
      alert('Agency not found');
      this.router.navigate(['/admin/office-management']);  // Navigate back if agency not found
    }
  }
  
  // Handle form submission
  async onSubmit(): Promise<void> {
    console.log('Submitting agency update:', this.agencyId, this.agencyName.trim()); // Log values
  
    if (this.agencyId && this.agencyName.trim()) {
      const { error } = await this.supabaseService.updateAgency(this.agencyId, this.agencyName.trim());
      if (error) {
        console.error('Error updating agency:', error.message);
        alert('Failed to update agency details.');
      } else {
        alert('Agency details updated successfully.');
        this.router.navigate(['/admin/office-management']);
      }
    } else {
      alert('Agency ID or name is invalid.');
    }
  }
  // Handle cancel action
  onCancel(): void {
    this.router.navigate(['/admin/office-management']);  // Navigate back without saving changes
  }
}
