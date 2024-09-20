// src/app/logs/logs.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LogEntry {
  action: 'Created' | 'Released' | 'Received' | 'Completed';
  dateTime: string;
  documentCode: string;
  createdBy?: string;
  releasedTo?: string;
  releasedBy?: string;
  receivedFrom?: string;
  receivedBy?: string;
  completedBy?: string;
  category: string;
  type: string;
  subjectTitle: string;
}

@Component({
  selector: 'app-a-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './a-logs.component.html',
  styleUrls: ['./a-logs.component.css'],
})
export class AlogsComponent implements OnInit {
  logs: LogEntry[] = [];
  filteredLogs: LogEntry[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private router: Router) {
    this.loadLogs();
  }

  ngOnInit(): void {}

  loadLogs(): void {
    this.logs = [
      {
        action: 'Created',
        dateTime: '2024-09-01 10:00',
        documentCode: 'DOC001',
        createdBy: 'John Doe',
        category: 'Internal',
        type: 'Report',
        subjectTitle: 'Monthly Report',
      },
      {
        action: 'Released',
        dateTime: '2024-09-01 11:00',
        documentCode: 'DOC001',
        releasedTo: 'External Agency A',
        releasedBy: 'Jane Smith',
        category: 'Internal',
        type: 'Report',
        subjectTitle: 'Monthly Report',
      },
      {
        action: 'Received',
        dateTime: '2024-09-02 09:00',
        documentCode: 'DOC002',
        receivedFrom: 'External Agency B',
        receivedBy: 'Michael Johnson',
        category: 'External',
        type: 'Memo',
        subjectTitle: 'Policy Update',
      },
      {
        action: 'Completed',
        dateTime: '2024-09-03 14:00',
        documentCode: 'DOC003',
        completedBy: 'Emily Brown',
        category: 'Internal',
        type: 'Project',
        subjectTitle: 'Q3 Goals',
      },
      // Additional mock logs can be added here
    ];
    this.filterLogs();
  }

  filterLogs(): void {
    this.filteredLogs = this.logs.filter((log) =>
      Object.values(log).some((val) =>
        val?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
    this.currentPage = 1;
    this.paginateLogs();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filterLogs();
  }

  paginateLogs(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredLogs = this.filteredLogs.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.paginateLogs();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }

  viewDetails(documentCode: string): void {
    this.router.navigate(['/user/view-details', documentCode]);
  }
}