import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SupabaseService, Document } from '../../core/services/supabase.service'; // Ensure correct path and import

@Injectable({
  providedIn: 'root'
})
export class FilterFunctionService {
  constructor(private supabaseService: SupabaseService) {}

  getDocuments(): Observable<Document[]> {
    return from(this.supabaseService.getDocuments());
  }

  filterDocuments(documents: Document[], query: string): Document[] {
    return documents.filter((doc) =>
      Object.values(doc).some((val) =>
        val?.toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }
}
