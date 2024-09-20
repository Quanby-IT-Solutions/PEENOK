import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../core/services/supabase.service';


@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit{

  constructor( ) { 
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  
}
