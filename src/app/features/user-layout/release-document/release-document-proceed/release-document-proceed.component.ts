import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { ActivatedRoute } from '@angular/router';
import JsBarcode from 'jsbarcode';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../../core/services/supabase.service';
interface DocumentDetails {
  documentCode: string;
  qrCodeData: string;
  barcodeData?: string;
  typeId?: string; // Optional field for the type_id
}

@Component({
  selector: 'app-release-document-proceed',
  standalone: true,
  imports: [CommonModule, QRCodeModule, FormsModule],
  templateUrl: './release-document-proceed.component.html',
  styleUrls: ['./release-document-proceed.component.css']
})
export class UReleaseDocumentProceedComponent implements OnInit {
  documentDetails: DocumentDetails | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService // Inject SupabaseService
  ) {}

  ngOnInit(): void {
    const documentCode = this.route.snapshot.paramMap.get('documentCode');
    
    if (documentCode) {
      this.fetchDocumentDetail(documentCode);
    }
  }

  async fetchDocumentDetail(documentCode: string): Promise<void> {
    const data = await this.supabaseService.getDocumentDetails(documentCode);

    if (data) {
      this.documentDetails = {
        documentCode: data.code,
        qrCodeData: data.code,
        typeId: data.type_id, // Fetch type_id from the response
        barcodeData: this.generateBarcode(data.code)
      };
    }
  }

  attachments = [
    { id: 1, name: 'Attachment1.pdf' },
    { id: 2, name: 'Attachment2.pdf' },
    { id: 3, name: 'Attachment3.pdf' },
  ];

  generateBarcode(code: string): string {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, code, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 80,
      displayValue: true
    });
    return canvas.toDataURL('image/png');
  }
}
