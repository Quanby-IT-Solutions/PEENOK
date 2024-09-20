import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, PostgrestError, SupabaseClient, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators'

interface Category{
  category_id: string;
  name: string;
}

interface AppUser extends SupabaseUser {
  account_id?: string | number;
  name?: string;
  username?: string;
  office_name?: string;
  account_status?: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
  email: string;  // Ensure email is a string and not undefined
}

// Interfaces for user and office
export interface User {
  account_id: number;
  name: string;
  username: string;
  office_name: string;
  office_id: string;
  email: string;
  account_status: string;
  role: string;
}

export interface Office {
  office_id: number;
  office_name: string;
}
export interface Document {
  document_title: string;
  document_id: number;
  code: string;
  subject_title: string;
  category_id: string;
  type_id: string;
  created_by: string;
  created_at: string; 
  office_id: string;
  office_name: string; // New field for office name
  category_name?: string; // New field for category name
  creator_name?: string; // New field for creator name
  type_name?: string; // New field for type name


}
  
export interface ReceivedDocument {
  received_document_id: string;
  document_code: string;
  document_id: string;
  document_subject_title: string;
  category_name: string;
  type_name: string;
  received_message: string;
  account_name: string;
  received_date_received: string;
  office_id: string;
  office_name: string;
  account_email: string;
}

export interface CompletedDocument {
  document_id: string;
  completed_by: number;
  message: string;
  subject_title: string;
  category_id: number;
  type_id: number;
  office_id: number;
  completed_at: string;  // Assuming there's a timestamp of completion
}

interface OfficeData {
  office_id: string;
  office_name: string;
  // other properties
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;
  currentUser: User | null = null;  // Add this line to store the current user details

  private documentsSubject = new BehaviorSubject<any[]>([]);
  documents$ = this.documentsSubject.asObservable();

  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  private typesSubject = new BehaviorSubject<any[]>([]);
  types$ = this.typesSubject.asObservable();

  private officesSubject = new BehaviorSubject<Office[]>([]);
  offices$ = this.officesSubject.asObservable();

  private supabaseInitPromise: Promise<void> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.supabaseInitPromise = this.initializeSupabase();
    this.initializeSupabase().then(() => {
      this.fetchDocuments();
      this.fetchCategories();
    }).catch(error => {
      console.error('Error during Supabase initialization:', error);
    });
    this.checkSession(); //Added
  }

  fetchAllData(): Observable<{ categories: any[]; types: any[]; account: any[]; office: any[] }> {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized.');
    }
  
    const categories$ = from(this.supabase.from('categories').select('*').then(response => response.data || []));
    const types$ = from(this.supabase.from('types').select('*').then(response => response.data || []));
    const account$ = from(this.supabase.from('account').select('*').then(response => response.data || []));
    const office$ = from(this.supabase.from('office').select('*').then(response => response.data || []));
  
    // Combine all observables into one
    return combineLatest([categories$, types$, account$, office$]).pipe(
      map(([categories, types, account, office]) => {
        console.log('Fetched categories:', categories);
        console.log('Fetched types:', types);
        console.log('Fetched accounts:', account);
        console.log('Fetched accounts:', office);
  
        return { categories, types, account, office };
      })
    );
  }

  async getUserOfficeId(userId: string): Promise<string | null> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return null;
    }
  
    const { data, error } = await this.supabase
      .from('accounts')  // Use table name without type argument
      .select('office_id')
      .eq('id', userId)
      .single();
  
    if (error) {
      console.error('Error fetching user office ID:', error.message);
      return null;
    }
  
    return data?.office_id || null;
  }
  
  async getOfficeById(officeId: string): Promise<OfficeData | null> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return null;
    }
  
    const { data, error } = await this.supabase
      .from('office')  // Use table name without type argument
      .select('*')
      .eq('office_id', officeId)
      .single();
  
    if (error) {
      console.error('Error fetching office details:', error.message);
      return null;
    }
  
    return data || null;
  }

  //Added
  private checkSession(): void {
    if (!this.supabase) {
        console.error('Supabase client not initialized.');
        return;
    }

    this.supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
            console.error('Error fetching session:', error.message);
        } else if (session) {
            console.log('Current session:', session);
        } else {
            console.error('No active session.');
        }
    });
}

  async getDocumentByCode(code: string) {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    return this.supabase
      .from('documents')
      .select('*')
      .eq('code', code)
      .single(); // Fetch a single document by code
  }

  async ngOnInit(): Promise<void> {
    this.fetchDocuments();
    await this.fetchCurrentUser();
  } 

  async getCurrentUserId(): Promise<string | null> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return null;
    }
  
    try {
      const { data: { user } } = await this.supabase.auth.getUser(); // Await the promise and destructure the user
      return user?.id || null; // Return the user ID if it exists
    } catch (error) {
      console.error('Error fetching current user:', (error as Error).message);
      return null;
    }
  }

  async insertDocument(document: any): Promise<{ data: any | null, error: PostgrestError | null }> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return { data: null, error: { message: 'Supabase client not initialized' } as PostgrestError };
    }
    
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .insert([document]);

      if (error) {
        console.error('Error inserting document:', error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error:', err);
      return { data: null, error: { message: 'Unexpected error occurred' } as PostgrestError };
    }
  }

  // Initialize Supabase client if running on the browser
  private async initializeSupabase(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
        console.log('Supabase client initialized successfully');
      } catch (error) {
        console.error('Error initializing Supabase client:', (error as Error).message);
        throw error;
      }
    }
  }

  private async ensureSupabaseInitialized(): Promise<void> {
    if (this.supabaseInitPromise) {
      // Wait for the initialization promise to complete
      await this.supabaseInitPromise;
    }
  }

  

 
  async getDocuments(): Promise<any> {
    await this.ensureSupabaseInitialized();

    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return { data: null, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*');

      if (error) {
        console.error('Error fetching documents:', error.message);
        return { data: null, error };
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error during document fetch:', error);
      return { data: null, error: 'Error during document fetch' };
    }
  }



  
  fetchDocuments(): void {
    this.supabaseInitPromise?.then(() => {
      this.getDocuments().then(({ data, error }) => {
        if (data) {
          this.documentsSubject.next(data);
        }
        if (error) {
          console.error('Error fetching documents:', error);
        }
      });
    }).catch(error => {
      console.error('Error during Supabase initialization:', error);
    });
  }

  filterDocuments(criteria: any): void {
    this.documents$.subscribe(documents => {
      const filteredDocuments = documents.filter(document => {
        // Apply your filtering logic here based on criteria
        return true; // Replace with actual condition
      });
      this.documentsSubject.next(filteredDocuments);
    });
  }

  // ================================
  // Authentication Methods
  // ================================

  // Sign in using email and password
  async signIn(email: string, password: string): Promise<{ data: any, error: any }> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return { data: null, error: 'Supabase client not initialized' };
    }
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign-in error:', (error as Error).message);
        return { data: null, error };
      }
      
      this.checkSession(); //Added 

      // Fetch current user details to store them
      const userResponse = await this.supabase
        .from('account')
        .select('*')
        .eq('email', email)
        .single();  // Fetch the current user based on the email

      if (userResponse.error) {
        console.error('Error fetching current user:', userResponse.error.message);
        return { data: null, error: userResponse.error };
      }

      this.currentUser = userResponse.data as User;  // Store the user details

      return { data, error: null };
    } catch (error) {
      console.error('Error during sign-in:', (error as Error).message);
      return { data: null, error: 'Error during sign-in' };
    }
  }

  async getAccountDocuments(): Promise<Document[]> {
    if (!this.supabase || !this.currentUser) {
      console.error('Supabase client or user not initialized.');
      return [];
    }
  
    try {
      const { data, error } = await this.supabase
        .rpc('get_account_documents');
  
      if (error) {
        console.error('Error fetching account documents:', error.message);
        return [];
      }
  
      if (this.currentUser && this.currentUser.role === 'admin') {
        return data as Document[];
      } else if (this.currentUser) {
        return (data as Document[]).filter((doc: Document) => doc.office_name === this.currentUser?.office_name);
      }
  
      return [];
    } catch (error) {
      console.error('Error:', (error as Error).message);
      return [];
    }
  }  

  // ================================
  // User Management Methods
  // ================================

  // Fetch user role by email
  async getUserRole(email: string): Promise<string | null> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return null;
    }
    try {
      const { data, error } = await this.supabase
        .from('account')
        .select('*')
        .eq('email', email)
        .single();
      if (error) {
        console.error('Error fetching user role:', (error as PostgrestError).message);
        return null;
      }
      return data?.role ?? null;
    } catch (error) {
      console.error('Error fetching user role:', (error as Error).message);
      return null;
    }
  }

  // Fetch all roles from the account table
  async getRoles(): Promise<string[]> {
    if (!this.supabase) return [];
    try {
      const { data, error } = await this.supabase.from('account').select('role');
      if (error) {
        console.error('Error fetching roles:', error.message);
        return [];
      }
      return data.map((item: { role: string }) => item.role);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      return [];
    }
  }

  // Fetch all users from the office_account_view
  async getUsers(): Promise<User[]> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return [];
    }
    
    const { data, error } = await this.supabase
    .from('office_account_view')
    .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data as User[];
  }

  async fetchCurrentUser(): Promise<void> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      this.currentUser = null;
      return;
    }
  
    try {
      const { data, error } = await this.supabase.auth.getSession();
  
      if (error) {
        console.error('Error fetching session:', error.message);
        this.currentUser = null;
        return;
      }
  
      // Ensure data and session are not null
      if (data?.session?.user) {
        const appUser = data.session.user as AppUser;
        this.currentUser = {
          ...appUser,
          account_id: appUser.account_id ? Number(appUser.account_id) : undefined,
          // ... map other properties as needed
        } as unknown as User;
      } else {
        this.currentUser = null;
      }
    } catch (error) {
      console.error('Unexpected error:', (error as Error).message);
      this.currentUser = null;
    }
  }

  // Insert new user account
  async insertAccount(name: string, username: string, password: string, office_name: string, role: string) {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return null;
    }
    const { data, error } = await this.supabase
      .from('account')
      .insert([{ name, username, password, office_name, role }]);
    if (error) {
      console.error('Error inserting account:', error);
      return null;
    }
    console.log('Account successfully inserted:', data);
    return data;
  }

  // ================================
  // Agency Management Methods
  // ================================

  // Create a new agency (office)
  async createAgency(newAgency: { office_name: string }): Promise<{ data: any, error: any }> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return { data: null, error: 'Supabase client not initialized' };
    }

    try {
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', (sessionError as Error).message);
        return { data: null, error: sessionError };
      }

      const user = session?.user;
      if (!user) {
        console.error('User is not authenticated');
        return { data: null, error: 'User is not authenticated' };
      }

      const agencyData = {
        ...newAgency,
        created_by: user.id
      };

      const { data, error } = await this.supabase.from('office').insert(agencyData);
      if (error) {
        console.error('Error inserting new agency:', error);
      }
      return { data, error };
    } catch (err) {
      console.error('An unexpected error occurred:', (err as Error).message);
      return { data: null, error: err };
    }
  }


  async fetchOffices(): Promise<void> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return;
    }

    try {
      const { data, error } = await this.supabase
        .from('office')
        .select('*')
        .order('office_name', { ascending: true });

      if (error) {
        console.error('Error fetching offices:', error.message);
        return;
      }

      this.officesSubject.next(data ?? []);
    } catch (error) {
      console.error('Unexpected error:', (error as Error).message);
    }
  }


  fetchTypesByCategory(categoryId: string): void {
    console.log('Fetching types for category ID:', categoryId); // Debug log
    if (!this.supabase) return;
  
    this.supabase
      .from('types')
      .select('*')
      .eq('category_id', categoryId)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching types:', error);
          return;
        }
        console.log('Fetched types:', data); // Debug log
        this.typesSubject.next(data || []);
      });
  }

  fetchCategories(): void {
    if (!this.supabase) return;

    this.supabase
      .from('categories')
      .select('category_id, name')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }
        this.categoriesSubject.next(data as Category[] || []);
      });
  }



  // Fetch all agencies (offices)
  async getAgencies(): Promise<Office[]> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return [];
    }

    const { data, error } = await this.supabase
      .from('office')
      .select('*')
      .order('office_name', { ascending: true });

    if (error) {
      console.error('Error fetching agencies:', error);
      return [];
    }

    return data ?? [];
  }

  // Fetch agency by ID
  async getAgencyById(agencyId: string): Promise<Office | null> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return null;
    }
  
    const { data, error } = await this.supabase
      .from('office')
      .select('*')
      .eq('office_id', agencyId)
      .single();
  
    if (error) {
      console.error('Error fetching agency:', error.message);
      return null;
    }
  
    return data;
  }
  
  // Update agency details
  async updateAgency(agencyId: string, newAgencyName: string): Promise<{ error: PostgrestError | null }> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return { error: { message: 'Supabase client not initialized' } as PostgrestError };
    }
  
    try {
      const { error } = await this.supabase
        .from('office')
        .update({ office_name: newAgencyName })
        .eq('office_id', agencyId);
  
      if (error) {
        console.error('Error updating agency:', error.message);
      }
  
      return { error };
    } catch (error) {
      console.error('Error updating agency:', (error as Error).message);
      return { error: { message: (error as Error).message } as PostgrestError };
    }
  }
  
  // Delete agency by ID
  async deleteAgency(office_id: number): Promise<{ error?: PostgrestError | null }> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return { error: null };
    }
  
    const { error } = await this.supabase
      .from('office')
      .delete()
      .eq('office_id', office_id);
    
    return { error };
  }

  // Fetch documents from the full_document_view based on the current user's office_id
  async getFullDocumentView(): Promise<ReceivedDocument[]> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('full_document_view')
        .select('*');

      if (error) {
        console.error('Error fetching documents from full_document_view:', error.message);
        return [];
      }

      return data as ReceivedDocument[];
    } catch (error) {
      console.error('Error fetching documents from full_document_view:', (error as Error).message);
      return [];
    }
  }



  // // Get the current logged-in user
  // getCurrentUser(): User | null {
  //   return this.currentUser;
  // }



  // documents table for admin

  // async getDocuments(): Promise<Document[]> {
  //   if (!this.supabase) {
  //     console.error('Supabase client not initialized:');
  //     return [];
  //   }
  //   try {
  //     const { data, error } = await this.supabase
  //       .from('documents')
  //       .select(`
  //         document_id,
  //         code,
  //         subject_title,
  //         category_id,
  //         type_id,
  //         created_by,
  //         created_at,
  //         office_id,
  //         categories!inner(name),  
  //         types!inner(name),       
  //         account!inner(name),     
  //         office!inner(office_name)  
  //       `);
  
  //     if (error) {
  //       console.error('Error fetching Documents', error.message);
  //       return [];
  //     }
  
  //     console.log('Fetched Documents:', data); // Log the fetched data
  
  //     // Map the data to add the joined names
  //     const documents = data.map((doc: any) => ({
  //       document_id: doc.document_id,
  //       code: doc.code,
  //       subject_title: doc.subject_title,
  //       category_id: doc.category_id,
  //       type_id: doc.type_id,
  //       created_by: doc.created_by,
  //       created_at: doc.created_at,
  //       office_id: doc.office_id,
  //       category_name: doc.categories.name,
  //       type_name: doc.types.name,
  //       creator_name: doc.account.name,
  //       office_name: doc.office.office_name,
  //     }));
  
  //     return documents as Document[];
  //   } catch (error) {
  //     console.error('Error fetching documents:', (error as Error).message);
  //     return [];
  //   }
  // }
  

  // documents table for admin



  async getUserDocuments(): Promise<Document[]> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return [];
    }

    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select(`
          document_id,
          code,
          subject_title,
          category_id,
          type_id,
          created_by,
          created_at,
          office_id,
          categories!inner(name),  
          types!inner(name),       
          account!inner(name),     
          office!inner(office_name)  
        `);

      if (error) {
        console.error('Error fetching Documents:', error.message);
        return [];
      }

      console.log('Fetched Documents:', data);

      const documents = data.map((doc: any) => ({
        document_id: doc.document_id,
        code: doc.code,
        subject_title: doc.subject_title,
        category_id: doc.category_id,
        type_id: doc.type_id,
        created_by: doc.created_by,
        created_at: doc.created_at,
        office_id: doc.office_id,
        category_name: doc.categories?.name,
        type_name: doc.types?.name,
        creator_name: doc.account?.name,
        office_name: doc.office?.office_name,
      }));

      return documents as Document[];
    } catch (error) {
      console.error('Error fetching documents:', (error as Error).message);
      return [];
    }
  }


  

  // Ensure this method is correctly implemented to fetch the current user
async getCurrentUser(): Promise<User | null> {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return null;
  }

  try {
    const { data, error } = await this.supabase.auth.getSession();
    if (error || !data.session) {
      console.error('Error fetching user session or no session found:', error?.message);
      return null;
    }

    const user = data.session.user;
    if (!user) {
      console.error('No user is logged in.');
      return null;
    }

    // Fetch user details based on the correct column names in the account table
    const { data: userDetails, error: userError } = await this.supabase
      .from('account') // Make sure this is the correct table name
      .select('*') // Ensure to select the correct columns
      .eq('email', user.email) // Adjust the condition based on your table schema
      .single();

    if (userError) {
      console.error('Error fetching user details:', userError.message);
      return null;
    }

    return userDetails as User;
  } catch (err) {
    console.error('Unexpected error fetching current user:', err);
    return null;
  }
}
async getDocumentDetails(documentId: string): Promise<any> {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return null;
  }

  try {
    const { data, error } = await this.supabase
      .from('documents')
      .select('code, document_id, category_id:category_id(name), type_id:type_id(name), subject_title, created_at, office_id:office_id(office_name),created_by ')
      .eq('code', documentId)
      .single();

    if (error) {
      console.error('Error fetching document details:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error:', (error as Error).message);
    return null;
  }
}
  
//almost done to finished myapp.current_user_id // Added
async markDocumentAsCompleted(documentId: string, message: string): Promise<{ data: any, error: any }> {
  if (!this.supabase || !this.currentUser) {
      console.error('Supabase client not initialized or user not logged in.');
      return { data: null, error: 'Supabase client not initialized or user not logged in' };
  }

  try {
      // Insert into completed_documents
      const { data: completedData, error: insertError } = await this.supabase
          .from('completed_documents')
          .insert({
              document_id: documentId,
              completed_by: this.currentUser.account_id,
              message: message
          });

      if (insertError) {
          console.error('Error inserting into completed_documents:', insertError.message);
          return { data: null, error: insertError };
      }

      // Remove from received_documents
      const { error: deleteError } = await this.supabase
          .from('received_documents')
          .delete()
          .eq('document_id', documentId);

      if (deleteError) {
          console.error('Error deleting from received_documents:', deleteError.message);
          return { data: null, error: deleteError };
      }

      return { data: completedData, error: null };
  } catch (error) {
      console.error('Error marking document as completed:', (error as Error).message);
      return { data: null, error: 'Error marking document as completed' };
  }
}

//almost done to finished myapp.current_user_id // Added
async getCompletedDocuments(): Promise<CompletedDocument[]> {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('view_completed_documents')
      .select('*');

    if (error) {
      console.error('Error fetching completed documents:', error.message);
      return [];
    }

    return data as CompletedDocument[];
  } catch (error) {
    console.error('Error fetching completed documents:', (error as Error).message);
    return [];
  }
}
  
async getAdminIncoming_Documents() {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('view_all_incoming')
      .select('*'); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching incoming documents:', error);
    throw error;
  }
}

async getAdminOutgoing_Documents() {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('view_all_outgoing')
      .select('*'); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching incoming documents:', error);
    throw error;
  }
}

async getOutgoing_Documents() {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('view_all_outgoing')
      .select('*'); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching incoming documents:', error);
    throw error;
  }
}


async getReceived_Documents() {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('received_documents_full_view')
      .select('*'); 

    if (error) {
      throw error;
    }
    console.log('Sean', data)
    return data;
  } catch (error) {
    console.error('Error fetching incoming documents:', error);
    throw error;
  }
}


async typesFilter() {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('types')
      .select('name'); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching incoming documents:', error);
    throw error;
  }
}

async officeFilter() {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('office')
      .select('office_name'); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching incoming documents:', error);
    throw error;
  }
}


async categoryFilter() {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('categories')
      .select('name'); 
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching incoming documents:', error);
    throw error;
  }
}




async getCompleted_Documents() {
  if (!this.supabase) {
    console.error('Supabase client not initialized.');
    return [];
  }

  try {
    const { data, error } = await this.supabase
      .from('view_completed_documents')
      .select('*'); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching incoming documents:', error);
    throw error;
  }
}



async insertOutgoingDocument(releaseData: {
  documentId: string;
  message: string;
  receivingOffice: string;
  dateReleased: string;
}): Promise<void> {
  if (!this.supabase) {
    throw new Error('Supabase client is not initialized.');
  }

  const { data, error } = await this.supabase
  .from('outgoing_documents')
  .insert([
    {
      document_id: releaseData.documentId,
      message: releaseData.message,
      receiving_office: releaseData.receivingOffice,
      date_realesed: releaseData.dateReleased
    }
  ]);

  if (error) {
    console.error('Error inserting outgoing document:', error);
    throw error;
  }
}


async insertIntoCompletedDocuments(documentId: string, accountName: string, message: string) {
  if (!this.supabase) {
    throw new Error('Supabase client is not initialized.');
  }
  
  const { data, error } = await this.supabase
    .from('completed_documents')
    .insert([{ document_id: documentId, completed_by: accountName, message: message }]);
  
  if (error) {
    console.error('Error inserting document:', error);
    return { data: null, error };
  }
  
  return { data, error: null };
}

async deleteDocument(documentId: string) {
  if (!this.supabase) {
    throw new Error('Supabase client is not initialized.');
  }
  
  const { data, error } = await this.supabase
    .from('outgoing_documents') // Replace with your actual table name
    .delete()
    .eq('document_id', documentId);
  
  if (error) {
    console.error('Error deleting document:', error);
    return { data: null, error };
  }
  
  return { data, error: null };
}


}
