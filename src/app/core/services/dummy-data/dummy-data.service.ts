// dummy-data.service.ts
import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  Office: string;
  status: string;
  role: string;
}

export interface Office {
  id: number;  // Add this line
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class DummyDataService {

  constructor() { }

  getUsers(): User[] {
    return [
      { id: 1, name: 'Catherine Smith', email: 'catherinesmith@gmail.com', Office: 'Office1', status: 'Active', role: 'User' },
      { id: 2, name: 'John Doe', email: 'johndoe@gmail.com', Office: 'Office1', status: 'Active', role: 'User' },
      { id: 3, name: 'Jane Smith', email: 'janesmith@gmail.com', Office: 'Office1', status: 'Inactive', role: 'User' },
      { id: 4, name: 'David Johnson', email: 'davidjohnson@gmail.com', Office: 'Office1', status: 'Active', role: 'User' },
      { id: 5, name: 'Sarah Williams', email: 'sarahwilliams@gmail.com', Office: 'Office1', status: 'Active', role: 'User' },
    ];
  }

  getAgencies(): Office[] {
    return [
      { id: 1, name: 'Office1' },
      { id: 2, name: 'Office2' },
      { id: 3, name: 'Office3' },
      { id: 4, name: 'Office4' },
      { id: 5, name: 'Office5' },
      { id: 6, name: 'Office6' },
      { id: 7, name: 'Office7' },
    ];
  }
}
