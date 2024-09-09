import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
  imports: [CardModule,ProgressBarModule,ButtonModule,DialogModule,CheckboxModule,FormsModule]
})

export class UploadDataFileComponent {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  fileSelected: boolean = false;
  rowError: boolean = false;
  selectedFile: File | null = null;
  firstRowContainsHeader: boolean = false;

  constructor(public dialogRef: DynamicDialogRef) {}

  triggerFileSelect() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (file && ['csv', 'xlsx', 'xls'].includes(fileType)) {
      this.readFile(file, fileType);
    } else {
      this.fileSelected = false;
      console.error('Please select a valid CSV, XLS, or XLSX file.');
    }
  }

  readFile(file: File, fileType: string) {
    const reader = new FileReader();

    // Handle CSV file
    if (fileType === 'csv') {
      reader.onload = (e: any) => {
        const csvContent = e.target.result;
        const rowCount = csvContent.split('\n').length;

        if (rowCount > 1500) {
          this.rowError = true;
          this.fileSelected = false;
          console.error('CSV file has more than 1500 rows.');
        } else {
          this.selectedFile = file;
          this.fileSelected = true;
          this.rowError = false;
        }
      };
      reader.readAsText(file);

    // Handle XLSX or XLS file
    } else {
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const rowCount = rows.length;

        if (rowCount > 1500) {
          this.rowError = true;
          this.fileSelected = false;
          console.error('Excel file has more than 1500 rows.');
        } else {
          this.selectedFile = file;
          this.fileSelected = true;
          this.rowError = false;
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.fileSelected = false;
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
}