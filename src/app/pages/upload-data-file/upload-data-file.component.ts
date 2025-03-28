import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import * as XLSX from 'xlsx';

@Component({
  standalone: true,
  selector: 'app-upload-data-file',
  templateUrl: './upload-data-file.component.html',
  styleUrls: ['./upload-data-file.component.scss'],
  imports: [CardModule, CommonModule, ToastModule, ProgressBarModule, ButtonModule, DialogModule, CheckboxModule, FormsModule]
})

export class UploadDataFileComponent {
  validFileFormat = [
    "Weight",
    "Shipment Id",
    "Customer Name",
    "Customer Number",
    "Category Type",
    "Address",
    "Pincode",
    "Opening Time",
    "Closing Time",
    "Touch Point Type",
    "Latitude",
    "Longitude",
    "External Id",
    "Instructions",
    "Mode of Payment",
    "Total",
  ]
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  fileSelected: boolean = false;
  pizza: string[] = [];
  rowError: boolean = false;
  selectedFile: File | null = null;
  firstRowContainsHeader: boolean = false;
  MAX_ROWS = 1500;
  MAX_FILE_SIZE_MB = 20;

  constructor(public dialogRef: DynamicDialogRef, private messageService: MessageService) { }

  triggerFileSelect() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      this.processFile(file);
    }
  }

  downloadSample() {
    const link = document.createElement('a');
    link.href = 'assets/sample_shipments.xlsx';
    link.download = 'sample_shipments.xlsx';
    link.click();
  }

  processFile(file: File) {
    const fileType = file?.name.split('.').pop()?.toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > this.MAX_FILE_SIZE_MB) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `File size exceeds ${this.MAX_FILE_SIZE_MB}MB. Please upload a smaller file.` });
      this.rowError = true;
      this.fileSelected = false;
      return;
    }

    if (!file || !['csv', 'xlsx', 'xls'].includes(fileType!)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid File Type' });
      return;
    }

    this.fileSelected = false;
    const reader = new FileReader();

    if (fileType === 'csv') {
      reader.onload = (e: ProgressEvent<FileReader>) =>
        this.processCSV((e.target?.result as string) || '', file);
      reader.readAsText(file);
    } else {
      reader.onload = (e: ProgressEvent<FileReader>) =>
        this.processExcel(e.target?.result as ArrayBuffer, file);
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `File exceeds ${this.MAX_ROWS} rows.` });

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
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const data: Uint8Array = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const columns: string[] = jsonData[0] as string[];

        if (
          columns.length !== 16 ||
          !columns.every((col: string) => this.validFileFormat.includes(col))
        ) {
          this.messageService.add({ severity: 'error', summary: 'Please upload a valid format.' });
          return;
        }

        this.dialogRef.close(this.selectedFile);
      };

      reader.readAsArrayBuffer(this.selectedFile);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      this.processFile(file);
    }
  }
}
