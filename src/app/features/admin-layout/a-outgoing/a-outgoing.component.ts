import { Component, OnInit, ViewChildren, QueryList, ElementRef,signal,computed} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import JsBarcode from 'jsbarcode';
import { SupabaseService } from '../../../core/services/supabase.service';

interface Document {
  code: string;
  document_id: string;
  subject_title: string;
  category_name: string;
  type_name: string;
  message: string;
  office_name: string;
  account_name: string;
  received_date_received: string;
  received: boolean;
}

@Component({
  selector: 'app-a-outgoing',
  standalone: true,
  imports: [CommonModule, QRCodeModule, FormsModule],
  templateUrl: './a-outgoing.component.html',
  styleUrls: ['./a-outgoing.component.css']
})
export class AOutgoingComponent implements OnInit {
  documents = signal<Document[]>([]);
  filteredDocuments = signal<Document[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  itemsPerPage = signal(20);

  totalPages = computed(() => Math.ceil(this.filteredDocuments().length / this.itemsPerPage()));

  showFilterModal = signal(false);
  types = signal<string[]>([]);
  offices = signal<string[]>([]);
  categories = signal<string[]>([]);

  selectedType = signal('All Types');
  selectedOffice = signal('All Offices');
  selectedCategory = signal('All Categories');

  @ViewChildren('qrcodeContainer') qrcodeContainers!: QueryList<ElementRef>;
  @ViewChildren('barcodeContainer') barcodeContainers!: QueryList<ElementRef>;
  constructor(private router: Router, private supabaseService: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.loadDocuments();
    await this.loadFilterOptions();

  }

  // async loadDocuments(): Promise<void> {
  //   try {
  //     const data = await this.supabaseService.getAdminOutgoing_Documents();
  //     console.log('Raw data from Supabase:', data); // Add this line
  
  //     const documents: Document[] = data.map(doc => ({
  //       code: doc.full_doc_code,
  //       document_id: doc.full_outgoing_doc_id,
  //       subject_title: doc.full_doc_subject_title,
  //       category_name: doc.full_category_name,
  //       type_name: doc.full_type_name,
  //       message: doc.full_doc_message,
  //       office_name: doc.full_office_name,
  //       account_name: doc.full_name,
  //       received_date_received: doc.full_date_released,  // Correct date field
  //       received: false // Set this based on a condition, if necessary
  //     }));
  //     console.log('Mapped documents:', documents); // Add this line
  
  //     this.documents.set(documents);
  //     this.filterDocuments();
  //   } catch (error) {
  //     console.error('Error loading documents:', error);
  //     // Handle error (e.g., show a notification to the user)
  //   }
  // }

  async loadDocuments(): Promise<void> {
    try {
      const data = await this.supabaseService.getOutgoing_Documents();
      console.log('Raw data from Supabase:', data);

      const documents: Document[] = data.map(doc => ({
        code: doc.full_doc_code,
        document_id: doc.full_outgoing_doc_id,
        subject_title: doc.full_doc_subject_title,
        category_name: doc.full_category_name,
        type_name: doc.full_type_name,
        message: doc.full_doc_message,
        office_name: doc.full_office_name,
        account_name: doc.full_name,
        received_date_received: doc.full_date_released,
        received: false
      }));
      console.log('Mapped documents:', documents);

      this.documents.set(documents);
      this.filterDocuments();
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }

  
  // filterDocuments(): void {
  //   const filtered = this.documents().filter((doc) =>
  //     Object.values(doc).some((val) =>
  //       val.toString().toLowerCase().includes(this.searchQuery().toLowerCase())
  //     )
  //   );
  //   this.filteredDocuments.set(filtered);
  //   this.currentPage.set(1);
  //   this.paginateDocuments();
  // }

  async loadFilterOptions(): Promise<void> {
    try {
      const [typesData, officesData, categoriesData] = await Promise.all([
        this.supabaseService.typesFilter(),
        this.supabaseService.officeFilter(),
        this.supabaseService.categoryFilter()
      ]);

      this.types.set(['All Types', ...typesData.map(t => t.name)]);
      this.offices.set(['All Offices', ...officesData.map(o => o.office_name)]);
      this.categories.set(['All Categories', ...categoriesData.map(c => c.name)]);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  }

  filterDocuments(): void {
    const filtered = this.documents().filter((doc) => {
      const matchesSearch = Object.values(doc).some((val) =>
        val.toString().toLowerCase().includes(this.searchQuery().toLowerCase())
      );
      const matchesType = this.selectedType() === 'All Types' || doc.type_name === this.selectedType();
      const matchesOffice = this.selectedOffice() === 'All Offices' || doc.office_name === this.selectedOffice();
      const matchesCategory = this.selectedCategory() === 'All Categories' || doc.category_name === this.selectedCategory();

      return matchesSearch && matchesType && matchesOffice && matchesCategory;
    });
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

  // changePage(page: number | string): void {
  //   const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
  //   if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages()) {
  //     this.currentPage.set(pageNumber);
  //     this.paginateDocuments();
  //   }
  // }

  changePage(page: number | string): void {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage.set(pageNumber);
      this.paginateDocuments();
    }
  }


  
  toggleFilterModal(): void {
    this.showFilterModal.set(!this.showFilterModal());
  }

  applyFilter(): void {
    this.filterDocuments();
    this.toggleFilterModal();
  }

  updateSelectedOffice(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedOffice.set(select.value);
  }

  updateSelectedCategory(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
  }

  

  updateSelectedType(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value);
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

  viewDetails(documentCode: string): void {
    console.log(`Viewing details for document: ${documentCode}`);
    this.router.navigate(['/admin/view-details', documentCode]);
  }

  cancelRelease(documentCode: string): void {

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
                    width: 100%;
                    overflow: hidden; /* Prevent scrollbars */
                  }
                  img {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100vw;
                    height: 100vh;
                    object-fit: contain;
                    transform: translate(-50%, -50%);
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
