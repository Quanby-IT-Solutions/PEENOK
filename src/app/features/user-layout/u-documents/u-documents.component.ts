import { Component, OnInit, signal, computed, ViewChild, ElementRef, QueryList, ViewChildren  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { map } from 'rxjs/operators';
import { switchMap } from 'rxjs';
import JsBarcode from 'jsbarcode';
import { QRCodeModule } from 'angularx-qrcode';

interface Document {
  document_id: string;
  code: string;
  subject: string;
  category: string;
  type: string;
  attachments: File[];
  createdBy: string;
  dateCreated: string;
  originOffice: string;
  logbook: LogEntry[];
  office_name: string; // New field for office name
  category_name?: string; // New field for category name
  creator_name?: string; // New field for creator name
  type_name?: string; // New field for type name

}

interface LogEntry {
  from: string;
  to: string;
  dateReleased: string;
}

interface NewDocument {
  subject: string;
  category: string;
  type: string;
  attachments: File[];
}

interface ReleaseDocumentInfo {
  document_id: string;
  code: string;
  receivingOffice: string;
  message: string;
}

interface Category {
  category_id: string; // This should match the type used in `supabase.service.ts`
  name: string;
}

interface User {
  user: {
    id: string;
    // other properties if needed
  };
}

interface Type {
  type_id: string;
  name: string;
}

@Component({
  selector: 'app-u-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, QRCodeModule],
  templateUrl: './u-documents.component.html',
  styleUrls: ['./u-documents.component.css']
})
export class UDocumentsComponent implements OnInit {
  @ViewChild('newDocumentModal') newDocumentModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('releaseDocumentModal') releaseDocumentModal!: ElementRef<HTMLDialogElement>;
  @ViewChild('filterModal') filterModal!: ElementRef<HTMLDialogElement>;
  @ViewChildren('qrcodeContainer') qrcodeContainers!: QueryList<ElementRef>;
  @ViewChildren('barcodeContainer') barcodeContainers!: QueryList<ElementRef>;


  newDocumentData: {
    subject: string;
    category: string;
    type: string;
    attachments: string[];
    office: string; // Add this line to include 'office'
  } = {
    subject: '',
    category: '',
    type: '',
    attachments: [],
    office: '' // Initialize this property
  };

  documents = signal<Document[]>([]);
  filteredDocuments = signal<Document[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = signal(5);

  offices: any[] = [];

  docs: any[] = [];
  categories: Category[] = [];
  types: Type[] = [];

  openDropdown = signal<string | null>(null);
  newDocument = signal<NewDocument>({ subject: '', category: '', type: '', attachments: [] });
  releaseDocumentInfo = signal<ReleaseDocumentInfo>({ code: '', receivingOffice: '', message: '', document_id: '' });

  totalPages = computed(() => Math.ceil(this.filteredDocuments().length / this.itemsPerPage()));
  supabase: any;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.supabaseService.documents$.subscribe((docs) => {
      this.docs = docs;
    });
    this.supabaseService.categories$.subscribe((categories: Category[]) => {
      this.categories = categories;
    });
    this.supabaseService.types$.subscribe((types: Type[]) => {
      this.types = types;
    });
    this.supabaseService.offices$.subscribe(offices => {
      this.offices = offices;
    });
    this.supabaseService.fetchDocuments();
    this.supabaseService.fetchCategories();
    this.supabaseService.fetchOffices();
    this.supabaseService.categories$.subscribe(categories => this.categories = categories);
    this.supabaseService.types$.subscribe(types => this.types = types);
    this.supabaseService.types$.subscribe((types: Type[]) => {
      if (types) {
        // Ensure 'types' is properly typed
        const names = types.map(type => type.name);
        this.types = types; // Update the local types array if needed
      }
    });
  }

  onCategoryChange(categoryId: string): void {
    console.log('Selected category ID:', categoryId); // Debug log
    this.newDocument.update(doc => ({ ...doc, category: categoryId }));
    this.supabaseService.fetchTypesByCategory(categoryId); // Fetch types based on selected category
  }

  fetchOffices(): void {
    this.supabaseService.getAgencies().then(offices => {
      this.offices = offices;
    }).catch(error => {
      console.error('Error fetching offices:', error);
    });
  }

  async onNewDocumentClick(): Promise<void> {
    const userId = await this.supabaseService.getCurrentUserId();
    if (userId) {
      console.log('Current User ID:', userId);
      // You can use the userId to associate the new document with the current user
    } else {
      console.error('Unable to fetch current user ID.');
    }
  }

  loadDocuments(): void {
    this.supabaseService.fetchAllData().pipe(
      switchMap(({ categories, types, account, office }) => {
        const categoryMap = new Map(categories.map((cat: any) => [cat.category_id, cat.name]));
        const typeMap = new Map(types.map((type: any) => [type.type_id, type.name]));
        const accountMap = new Map(account.map((acc: any) => [acc.account_id, acc.name]));
        const officeMap = new Map(office.map((acc: any) => [acc.office_id, acc.office_name]));
  
        return this.supabaseService.documents$.pipe(
          map((data: any[]) => {
            const uniqueDocuments = Array.from(
              new Map(data.map(doc => [doc.code, doc])).values()
            );
            return uniqueDocuments.map((doc: any): Document => ({
              document_id: doc.document_id,
              code: doc.code,
              subject: doc.subject_title,
              category: categoryMap.get(doc.category_id) || 'Unknown',
              type: typeMap.get(doc.type_id) || 'Unknown',
              createdBy: accountMap.get(doc.created_by) || 'Unknown',
              dateCreated: doc.created_at,
              logbook: [],
              attachments: [],
              originOffice: officeMap.get(doc.office_id) || 'Unknown',
              office_name: doc.office_name
            }));
          })
        );
      })
    ).subscribe((documents: Document[]) => {
      if (documents) {
        console.log('Mapped documents:', documents);
        this.docs = documents;
        this.filteredDocuments.set(documents);
      }
    });
  }

  filterDocuments(): void {
    const filtered = this.documents().filter((doc) =>
      Object.values(doc).some((val) =>
        val.toString().toLowerCase().includes(this.searchQuery().toLowerCase())
      )
    );
    this.filteredDocuments.set(filtered);
    this.currentPage.set(1);
    this.paginateDocuments();
  }

  paginateDocuments(): void {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    const paginatedDocs = this.filteredDocuments().slice(startIndex, endIndex);
    this.filteredDocuments.set(paginatedDocs);
  }

  changePage(page: number | string): void {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage.set(pageNumber);
      this.paginateDocuments();
    }
  }

  toggleDropdown(code: string) {
    if (this.openDropdown() === code) {
      this.openDropdown.set(null);
    } else {
      this.openDropdown.set(code);
    }
  }

  editDocument(code: string) {
    console.log('Edit document:', code);
    // Implement edit document logic
  }

  archiveDocument(code: string) {
    console.log('Archive document:', code);
    // Implement archive document logic
  }

  deleteDocument(code: string) {
    console.log('Delete document:', code);
    // Implement delete document logic
  }

  async createNewDocument(): Promise<void> {
    try {
      const userId = await this.supabaseService.getCurrentUserId(); // Get current user ID
      if (!userId) {
        window.alert('Failed to determine the current user.');
        return;
      }
  
      // Ensure that all fields are properly populated
      if (!this.newDocumentData.subject) {
        window.alert('Subject/Title is required.');
        return;
      }
      if (!this.newDocumentData.category) {
        window.alert('Category is required.');
        return;
      }
      if (!this.newDocumentData.type) {
        window.alert('Type is required.');
        return;
      }
  
      // Generate a unique code
      const uniqueCode = this.generateUniqueCode();
  
      const documentData = {
        code: uniqueCode, // Assign the generated unique code here
        subject_title: this.newDocumentData.subject,
        category_id: this.newDocumentData.category,
        type_id: this.newDocumentData.type,
        created_by: userId, // Use the current user ID
        attachments: this.newDocumentData.attachments,
        created_at: new Date().toISOString()
      };
  
      const { data, error } = await this.supabaseService.insertDocument(documentData);
  
      if (error) {
        console.error('Error saving document:', error.message);
        window.alert('Error saving document: ' + error.message);
        return;
      }
  
      window.alert('Document created successfully!');
      this.loadDocuments(); // Reload the documents list
    } catch (err) {
      if (err instanceof Error) {
        console.error('Unexpected error:', err.message);
        window.alert('Unexpected error: ' + err.message);
      } else {
        console.error('An unexpected error occurred:', err);
        window.alert('An unexpected error occurred.');
      }
    }
  }

  // Example SupabaseService method for getting current user
  async getCurrentUser(): Promise<User | null> {
    if (!this.supabase) {
      console.error('Supabase client not initialized.');
      return null;
    }
  
    // Check session
    const session = this.supabase.auth.session();
    if (!session) {
      console.error('No active session found.');
      return null;
    }
  
    try {
      const { data, error } = await this.supabase.auth.getUser();
      console.log('Supabase getUser response:', data, error);
      
      if (error) {
        console.error('Error fetching user:', error.message);
        return null;
      }
  
      return data?.user ? { user: { id: data.user.id } } : null;
    } catch (err) {
      if (err instanceof Error) {
        console.error('Unexpected error occurred while fetching user:', err.message);
      } else {
        console.error('Unexpected error occurred while fetching user:', err);
      }
      return null;
    }
  }
  
  
get currentUser() {
  return this.supabase.auth.getUser();
}

generateUniqueCode(): string {
  // Generate an 8-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


  async getCurrentOffice(): Promise<string> {
    // Implement this method based on how you store and retrieve office information
    // For now, returning a placeholder value
    return 'Current Office';
  }

  async releaseDocument(): Promise<void> {
    const currentUser = await this.getCurrentUser();
    const currentOffice = await this.getCurrentOffice();
  
    // Update the documents state
    this.documents.update(docs =>
      docs.map(doc => {
        if (doc.code === this.releaseDocumentInfo().code) {
          const newLogEntry: LogEntry = {
            from: currentOffice,
            to: this.releaseDocumentInfo().receivingOffice,
            dateReleased: new Date().toISOString()
          };
          return {
            ...doc,
            logbook: [...doc.logbook, newLogEntry]
          };
        }
        return doc;
      })
    );
  
    // Save the released document to the database
    await this.saveReleasedDocumentToDb({
      documentId: this.releaseDocumentInfo().code, // Assuming this is the document ID
      message: this.releaseDocumentInfo().message,
      receivingOffice: this.newDocumentData.office,
      dateReleased: new Date().toISOString()
    });
  
    // Clear release document info and close modal
    this.releaseDocumentInfo.set({ code: '', receivingOffice: '', message: '', document_id: '' });
    this.releaseDocumentModal.nativeElement.close();
  }
  
  // Method to save released document to the database
  async saveReleasedDocumentToDb(releaseData: {
    documentId: string;
    message: string;
    receivingOffice: string;
    dateReleased: string;
  }): Promise<void> {
    // Replace with your actual database service method
    await this.supabaseService.insertOutgoingDocument(releaseData);
  }

  viewDetails(documentCode: string): void {
    this.router.navigate(['/user/view-details', documentCode]);
  }

  handleFileInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files) {
      this.newDocument.update(current => ({
        ...current,
        attachments: Array.from(files)
      }));
    }
  }

  updateNewDocument(field: keyof NewDocument, value: string): void {
    this.newDocument.update(current => ({ ...current, [field]: value }));
  }

  updateReleaseDocumentInfo(field: keyof ReleaseDocumentInfo, value: string): void {
    this.releaseDocumentInfo.update(current => ({ ...current, [field]: value }));
  }

  getPaginationArray(): (number | string)[] {
    const totalPages = this.totalPages();
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const currentPage = this.currentPage();
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }

  openReleaseModal(documentCode: string): void {
    // Ensure the signal is updated before showing the modal
    this.releaseDocumentInfo.set({ code: documentCode, receivingOffice: '', message: '', document_id: '' });
    // Show the modal after updating the signal
    this.releaseDocumentModal.nativeElement.showModal();
  }

  scanQRCode(): void {
    console.log('Scanning QR Code');
  }

  fetchInitialData(): void {
    // Fetch categories
    this.supabaseService.fetchCategories();
    this.supabaseService.categories$.subscribe((categories: Category[]) => {
      this.categories = categories;
    });

    // Fetch offices
    this.supabaseService.fetchOffices();
    this.supabaseService.offices$.subscribe((offices) => {
      this.offices = offices;
    });
  }


  // onCategoryChange(categoryId: string): void {
  //   console.log('Selected category ID:', categoryId); // Debug log
  //   this.newDocument.update(doc => ({ ...doc, category: categoryId }));
  //   this.supabaseService.fetchTypesByCategory(categoryId); // Fetch types based on selected category
  // }


  applyFilter(): void {
    this.filterModal.nativeElement.close();

    const filtered = this.documents().filter((doc) => {
      return (
        (this.filterData.category ? doc.category === this.filterData.category : true) &&
        (this.filterData.type ? doc.type === this.filterData.type : true) &&
        (this.filterData.office ? doc.originOffice === this.filterData.office : true)
      );
    });

    this.filteredDocuments.set(filtered);
    this.currentPage.set(1);
    this.paginateDocuments();
  }

  filterData = {
    category: '',
    type: '',
    office: '',
  };

  openFilterModal(): void {
    this.filterModal.nativeElement.showModal();
  }


  printQRCode(doc: Document): void {
    const qrCodeContainer = this.qrcodeContainers.find(container => container.nativeElement.getAttribute('data-doc-code') === doc.code);
    if (qrCodeContainer) {
      const qrCodeCanvas = qrCodeContainer.nativeElement.querySelector('canvas');
      if (qrCodeCanvas) {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
          const qrCodeDataUrl = qrCodeCanvas.toDataURL();
          printWindow.document.open();
          printWindow.document.write(`
            <html>
              <head>
                <title>Print QR Code</title>
                <style>
                  body, html {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                  }
                </style>
              </head>
              <body>
                <img src="${qrCodeDataUrl}" />
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
      }
    }
  }
  
  generateAndPrintBarcode(doc: Document): void {
    console.log("Generate and Print Barcode:", doc);
    const barcodeContainer = this.barcodeContainers.find(container => container.nativeElement.getAttribute('data-doc-code') === doc.code);
    if (barcodeContainer) {
      const barcodeElement = barcodeContainer.nativeElement.querySelector('svg');
      if (barcodeElement) {
        // Generate the barcode
        JsBarcode(barcodeElement, doc.code, { format: 'CODE128', width: 2, height: 40, displayValue: true });
        
        // Ensure the barcode is rendered before printing
        setTimeout(() => {
          const barcodeSvg = barcodeElement.outerHTML;
          const printWindow = window.open('', '', 'height=600,width=800');
          if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print Barcode</title>
                  <style>
                    body, html {
                      margin: 0;
                      padding: 0;
                      height: 100%;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    }
                    svg {
                      max-width: 100%;
                      height: auto;
                    }
                  </style>
                </head>
                <body>
                  ${barcodeSvg}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
          }
        }, 100); // Adjust the timeout if necessary
      }
    }
  }
  
}
