import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { gsap } from 'gsap';

  Chart.register(...registerables);
  
@Component({
  selector: 'app-u-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './u-dashboard.component.html',
  styleUrl: './u-dashboard.component.css'
})
export class UDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  documentStats = [
    { title: 'Total Documents', value: 10, icon: 'fa-folder', iconColor: 'text-blue-500' },
    { title: 'Incoming Documents', value: 4, icon: 'fa-inbox', iconColor: 'text-green-500' },
    { title: 'Received Documents', value: 5, icon: 'fa-check-circle', iconColor: 'text-yellow-500' },
    { title: 'Outgoing Documents', value: 1, icon: 'fa-paper-plane', iconColor: 'text-red-500' }
  ];

  alerts = [
    { type: 'warning', title: 'Urgent Review Needed', message: '3 documents require immediate attention.' },
    { type: 'info', title: 'System Update', message: 'Scheduled maintenance on Saturday, 10 PM - 2 AM.' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

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
        this.router.navigate(['/user/received']);
        break;
      case 'transmit':
        this.router.navigate(['/user/outgoing']);
        break;
      case 'add':
        this.router.navigate(['/user/documents']);
        break;
      default:
        console.log(`Unhandled quick action: ${action}`);
    }
  }
}