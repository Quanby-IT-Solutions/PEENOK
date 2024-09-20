import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import JsBarcode from 'jsbarcode';
import { SupabaseService } from '../../../core/services/supabase.service';

interface DocumentDetails {
  documentCode: string;
  qrCode: string;
  barcode?: string;
  originOffice: string;
  category: string;
  type: string;
  subjectTitle: string;
  createdBy: string;
  dateCreated: string;
  currentLocation: string;
  status: string;
  logbook: Array<{ date: string; from: string; to: string; messageRemarks: string }>;
  attachments: string[];
  receivedFrom?: string;
  receivedBy?: string;
  receivedDate?: string;
  categoryId?: string;
}

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css']
})
export class ViewDetailsComponent implements OnInit {
  documentDetails: DocumentDetails | null = null;
  @ViewChild('barcode', { static: false }) barcodeElement!: ElementRef<HTMLCanvasElement>;

  constructor(private route: ActivatedRoute, private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    const documentCode = this.route.snapshot.paramMap.get('documentCode');
    if (documentCode) {
      this.loadDocumentDetails(documentCode);
    }
  }

  async loadDocumentDetails(documentCode: string): Promise<void> {
    try {
      const documentData = await this.supabaseService.getDocumentDetails(documentCode);

      if (documentData) {
        const currentLocation = await this.getCurrentCity();
        
        this.documentDetails = {
          documentCode: documentCode,
          qrCode: documentCode,
          barcode: this.generateBarcode(documentData.code),
          originOffice: documentData.office_id?.office_name || '',
          category: documentData.category_id?.name || '',
          type: documentData.type_id?.name || '',
          subjectTitle: documentData.subject_title || '',
          createdBy: documentData.created_by || '', // Updated to use account_name
          dateCreated: documentData.created_at || '',
          currentLocation: currentLocation,
          status: documentData.status || '',
          logbook: [], // Empty array for now
          attachments: [], // Empty array for now
          receivedFrom: documentData.received_from || '',
          receivedBy: documentData.received_by || '',
          receivedDate: documentData.received_date || '',
          categoryId: documentData.category_id?.id || '',
        };
      }
    } catch (error) {
      console.error('Error loading document details:', error);
      // Handle error (e.g., show error message to user)
    }
  }

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

  async getCurrentCity(): Promise<string> {
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            resolve(data.address.city || data.address.town || data.address.village || 'Unknown');
          } catch (error) {
            console.error('Error fetching location:', error);
            resolve('Unknown');
          }
        }, () => {
          console.error('Unable to retrieve your location');
          resolve('Unknown');
        });
      } else {
        console.log("Geolocation not available");
        resolve('Unknown');
      }
    });
  }
}