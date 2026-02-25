import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import QRCodeStyling from 'qr-code-styling';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './qr-generator.html',
  styleUrl: './qr-generator.css'
})
export class QrGenerator implements AfterViewInit {

  @ViewChild('qrContainer', { static: false })
  qrContainer!: ElementRef;

  // Basic QR Settings
  url: string = '';
  format: 'png' | 'jpeg' | 'svg' = 'png';
  size: number = 300;
  foregroundColor: string = '#000000';
  backgroundColor: string = '#ffffff';

  formats: ('png' | 'jpeg' | 'svg')[] = ['png', 'svg', 'jpeg'];

  // Logo
  logoFile: string | null = null;
  isDragging = false;

  // QR Instance
  qrCode!: QRCodeStyling;
  qrGenerated = false;
  logoSize: number = 0.4; // default 40%
  circularLogo: boolean = false;
  logoVisible = false;

  // -------------------------
  // LIFECYCLE
  // -------------------------

  ngAfterViewInit() {
    this.qrCode = new QRCodeStyling({
      width: this.size,
      height: this.size,
      type: 'canvas',
      data: '',
      dotsOptions: {
        color: this.foregroundColor,
        type: 'rounded'
      },
      backgroundOptions: {
        color: this.backgroundColor
      }
    });

    this.qrCode.append(this.qrContainer.nativeElement);
  }

  // -------------------------
  // AUTO UPDATE QR
  // -------------------------

  updateQR() {
    if (!this.url) {
      this.qrGenerated = false;
      return;
    }

    this.qrCode.update({
      width: this.size,
      height: this.size,
      type: this.format === 'svg' ? 'svg' : 'canvas',
      data: this.url,
      image: this.logoFile || undefined,
      dotsOptions: {
        color: this.foregroundColor,
        type: 'rounded'
      },
      backgroundOptions: {
        color: this.backgroundColor
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 8,
        imageSize: this.logoSize
      }
    });

    this.qrGenerated = true;

    // trigger soft fade animation
    this.triggerQRAnimation();
  }

  // -------------------------
  // DOWNLOAD
  // -------------------------

  downloadQR() {
    if (!this.qrGenerated) return;

    this.qrCode.download({
      name: 'qr-code',
      extension: this.format
    });
  }

  // -------------------------
  // LOGO UPLOAD
  // -------------------------

  onLogoUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.logoFile = URL.createObjectURL(file);
    this.logoVisible = false;

    setTimeout(() => {
      this.logoVisible = true;
    }, 50);

    this.updateQR();
  }

  removeLogo() {
    this.logoFile = null;
    this.updateQR();
  }

  // -------------------------
  // DRAG & DROP
  // -------------------------

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (!file) return;

    this.logoFile = URL.createObjectURL(file);
    this.updateQR();
  }

  // -------------------------
  // FORMAT SELECT (Custom Dropdown Support)
  // -------------------------

  selectFormat(value: 'png' | 'jpeg' | 'svg') {
    this.format = value;
    this.updateQR();
  }

  triggerQRAnimation() {
    const el = this.qrContainer.nativeElement;
    el.classList.remove('qr-visible');
    void el.offsetWidth; // force reflow
    el.classList.add('qr-visible');
  }
}