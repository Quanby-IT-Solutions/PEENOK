import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catergory-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catergory-management.component.html',
  styleUrl: './catergory-management.component.css'
})
export class CatergoryManagementComponent {
  categories = [
    { category: 'Category1', types: ['Type1'] },
    { category: 'Category2', types: ['Type1'] }
  ];
}
