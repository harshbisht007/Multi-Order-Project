import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import * as XLSX from 'xlsx';

@Component({
  standalone: true,
  selector: 'app-upload-data-file',
  templateUrl: './upload-data-file.component.html',
  styleUrls: ['./upload-data-file.component.css'],
  imports: [CardModule, CommonModule, ProgressBarModule, ButtonModule, DialogModule, CheckboxModule, FormsModule]
})

export class UploadDataFileComponent {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  fileSelected: boolean = false;
  rowError: boolean = false;
  selectedFile: File | null = null;
  firstRowContainsHeader: boolean = false;
  MAX_ROWS = 1500;

  constructor(public dialogRef: DynamicDialogRef) { }

  triggerFileSelect() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.processFile(file);
  }
  downloadSample() {
    const link = document.createElement('a');
    link.href = 'assets/sample_shipments.csv';
    link.download = 'sample_shipments.csv';
    link.click();
  }

  processFile(file: File) {
    const fileType = file?.name.split('.').pop()?.toLowerCase();
    if (!file || !['csv', 'xlsx', 'xls'].includes(fileType!)) {
      console.error('Invalid file type.');
      return;
    }

    this.fileSelected = false; // Reset file selection state before processing
    const reader = new FileReader();

    if (fileType === 'csv') {
      reader.onload = (e: any) => this.processCSV(e.target.result, file);
      reader.readAsText(file);
    } else {
      reader.onload = (e: any) => this.processExcel(e.target.result, file);
      reader.readAsArrayBuffer(file);
    }
  }

  processCSV(csvContent: string, file: File) {
    const rowCount = csvContent.split('\n').length;
    this.setFileState(file, rowCount);
  }

  processExcel(data: ArrayBuffer, file: File) {
    const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    this.setFileState(file, rows.length);
  }

  setFileState(file: File, rowCount: number) {
    if (rowCount > this.MAX_ROWS) {
      this.rowError = true;
      this.fileSelected = false;
      console.error(`File exceeds ${this.MAX_ROWS} rows.`);
    } else {
      this.selectedFile = file;
      this.fileSelected = true;
      this.rowError = false;
    }
  }

  removeFile() {
    this.fileSelected = false;
    this.selectedFile = null;
    this.rowError = false;
  }

  onUpload() {
    if (this.selectedFile) {
      this.dialogRef.close(this.selectedFile);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  // Drag and drop event handling
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior to avoid blinking
  }

  onDrop(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior (e.g., opening the file)
    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      this.processFile(file);
    }
  }
}
