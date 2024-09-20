import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID, signal, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { Subject, debounceTime } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';



@Component({
  selector: 'app-release-document',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, QRCodeModule,LottieComponent],
  templateUrl: './release-document.component.html',
  styleUrl: './release-document.component.css'
})
export class AReleaseDocumentComponent {

  // title = 'ejemplo_lottie';

  // options: AnimationOptions = {
  //   path: '/assets/lottie/scanqr.json',
  // };

  // animationCreated(animationItem: AnimationItem): void {
  //   console.log(animationItem);
  // }

  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '500px',
    margin: '0 auto',
  };

  documentCode = signal('');
  private inputChangeSubject = new Subject<string>();

  @ViewChild('documentCodeInput') documentCodeInput!: ElementRef; // Reference to input element
  @ViewChild('activateScannerButton') activateScannerButton!: ElementRef; // Reference to button element

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.inputChangeSubject.pipe(debounceTime(300)).subscribe(() => this.updateCode());
  }

  updateCode() {
    this.generateQRCode();
    // Removed generateBarcode() call
  }

  activateScanner() {
    console.log('Activating QR code scanner');
    // Set up key event listeners to type in the input box
    this.activateScannerButton.nativeElement.focus(); // Focus on the button
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Capture typing input and direct it to the input field
    const key = event.key;
    if (key.length === 1 || key === 'Backspace' || key === 'Delete') { // Handle normal keys and backspace
      this.documentCodeInput.nativeElement.focus();
    }
  }

  scanQRCode() {
    // Implement QR code scanning logic here
    console.log('Scanning QR Code');
    // After scanning, update the documentCode
    // this.documentCode.set(scannedCode);
  }

  cancel() {
    console.log('Cancelling');
    // Navigate back or to a specific page
    // this.router.navigate(['/some-page']);
  }

  proceed() {
    console.log('Proceed button clicked', this.documentCode());
    if (this.documentCode()) {
      this.router.navigate(['/admin/release-document-proceed', this.documentCode()]);
    } else {
      console.error('No document code entered');
    }
  }

  generateQRCode() {
    // Function to generate QR Code
  }

  onDocumentCodeChange(value: string) {
    this.documentCode.set(value);
    this.inputChangeSubject.next(value); // Emit value change
  }

}
