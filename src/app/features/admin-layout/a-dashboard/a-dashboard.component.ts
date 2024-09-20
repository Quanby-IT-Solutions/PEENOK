import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
  
@Component({
  selector: 'app-a-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './a-dashboard.component.html',
  styleUrl: './a-dashboard.component.css'
})
export class ADashboardComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  documentStats = [
    { title: 'Pending Review', value: 23, icon: 'hourglass-half', iconColor: 'text-yellow-500' },
    { title: 'Approved', value: 45, icon: 'check-circle', iconColor: 'text-green-500' },
    { title: 'Rejected', value: 7, icon: 'exclamation-circle', iconColor: 'text-red-500' },
    { title: 'Total Documents', value: 75, icon: 'file-alt', iconColor: 'text-blue-500' }
  ];

  alerts = [
    { type: 'warning', title: 'Pending Approvals', message: '5 documents require immediate attention.' },
    { type: 'info', title: 'System Update', message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM.' }
  ];

  quickActions = [
    { type: 'receive', label: 'Received', bgClass: 'bg-orange-500 hover:bg-orange-600'},
    { type: 'transmit', label: 'Released', bgClass: 'bg-green-500 hover:bg-green-600' },
    { type: 'add', label: 'Add New', bgClass: 'bg-purple-500 hover:bg-purple-600'}
  ];
  constructor(private router: Router) {}

  ngOnInit() {
    this.initChart();
  }
  

ngAfterViewInit(): void {
    this.initChart();
    this.animateStats();
  }

  private initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!; // Added '!' to assert non-null assertion
    new Chart(ctx, {
      type: 'bar', // Changed to 'bar' chart
      data: {
        labels: ['Incoming', 'Received', 'Outgoing'],
        datasets: [{
          data: [4, 5, 1],
          backgroundColor: ['#FCD34D', '#34D399', '#F87171'],
          borderColor: ['#FBBF24', '#10B981', '#EF4444'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Optionally hide legend for a cleaner bar chart look
          },
          title: {
            display: true,
            text: 'Document Status Overview'
          }
        },
        scales: { // Added scales for bar chart axes
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Status'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count'
            }
          }
        }
      }
    });
  }
  
  private animateStats(): void {
    gsap.from('.stat-card', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  quickAction(action: string): void {
    switch (action) {
      case 'receive':
        this.router.navigate(['/admin/a-received']);
        break;
      case 'transmit':
        this.router.navigate(['/admin/a-outgoing']);
        break;
      case 'add':
        this.router.navigate(['/admin/a-documents']);
        break;
      default:
        console.log(`Unhandled quick action: ${action}`);
    }
  }
}