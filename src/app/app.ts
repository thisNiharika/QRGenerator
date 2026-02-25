import { Component } from '@angular/core';
import { QrGenerator } from './qr-generator/qr-generator';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QrGenerator],
  template: `<app-qr-generator></app-qr-generator>`
})
export class App {}