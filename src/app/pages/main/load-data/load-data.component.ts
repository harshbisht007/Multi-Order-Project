import {Component, effect, EventEmitter, OnInit, Output, ViewChild, viewChild} from '@angular/core';
import {TouchPoint, Zone} from "../../../graphql/generated";
import { Table, TableModule, TableRowSelectEvent, TableRowUnSelectEvent } from "primeng/table";
import { Button } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownChangeEvent, DropdownModule } from "primeng/dropdown";
import { TagModule } from "primeng/tag";
import { SliderModule } from "primeng/slider";
import { ZoneService } from '../../../core/services/zone.service';
import { TooltipModule } from 'primeng/tooltip';
import * as XLSX from 'xlsx';
import { GraphqlService } from "../../../core/services/graphql.service";
import { gql } from "apollo-angular";
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule, NgForOf } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ValidateColumnPipe } from '../../../core/pipes/validate-column.pipe';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadDataFileComponent } from '../../upload-data-file/upload-data-file.component';

export interface CustomTouchPoint extends TouchPoint {
  latitude: number;
  longitude: number;
  status: Boolean

}

export interface CustomValidObject {
  classes: { [key: string]: boolean };
  message: string;
  imageSrc: string;
}


@Component({
  selector: 'app-load-data',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    TooltipModule,
    ButtonModule,
    Button,
    FormsModule,
    CheckboxModule,
    ToastModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    TagModule,
    ConfirmDialogModule,
    RippleModule,
    SliderModule,
    ValidateColumnPipe,
    NgForOf,
    DialogModule,
    DynamicDialogModule
  ],
  providers: [ConfirmationService, MessageService, ZoneService, DialogService],

  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.scss'
})
export class LoadDataComponent implements OnInit {
  rows: CustomTouchPoint[] = [];
  @ViewChild('fileInput') fileInput!: any;
  @Output() goToConfiguration: EventEmitter<string> = new EventEmitter();
  @Output() dataForMarker: EventEmitter<any> = new EventEmitter();

  loading: boolean = false;
  headers: string[] = [];
  showActions: any = true;
  selectedSource: any = 'upload';
  sources: any;
  isEditable: boolean = false
  zones = this.zoneService.zones;
  selectedZone!: Zone;
  selectedItems: any;
  totalInvalid: number = 0;
  showToastForValidCheck: boolean = false;
  validColumnObject: CustomValidObject = {
    classes: {},
    message: '',
    imageSrc: ''
  }
  currentEditingRow: any = null;
  dialogRef: DynamicDialogRef | undefined;


  constructor(private zoneService: ZoneService, private graphqlService: GraphqlService,
              private confirmationService: ConfirmationService, private messageService: MessageService,
              public dialogService: DialogService,) {
  }

  ngOnInit() {
    this.sources = [
      { name: 'Upload File', value: 'upload' },
      { name: 'Fetch from Database', value: 'fetch' }
    ];
  }

  onZoneChange(event: DropdownChangeEvent) {
  }


  validateData() {
    this.totalInvalid = 0;
    this.rows.forEach((obj: any) => {
      const hasComma = Object.values(obj).some(value => typeof value === 'string' && value.includes(','));
      const invalidTouchPointType = obj.touch_point_type !== 'PICKUP' && obj.touch_point_type !== 'DROP';
      obj.status = hasComma || invalidTouchPointType ? 'INVALID' : 'VALID';
    });

    this.showToastForValidCheck = true;

    this.rows.map((obj: any) => {
      if (obj.status === 'INVALID') {
        this.totalInvalid += 1;
      }
    })

    this.validColumnObject = {
      classes: {
        'flex': true,
        'mr-2': true,
        'px-3': true,
        'py-2': true,
        'text-base': this.totalInvalid > 0,
        'font-normal': true,
        'warning_message': this.totalInvalid > 0,
        'success_message': this.totalInvalid === 0,
        'ml-1': true,
        'min-w-[550px]': this.totalInvalid > 0,
        'min-w-[270px]': this.totalInvalid === 0
      },

      message: this.totalInvalid > 0
        ? `${this.totalInvalid} Rows invalid. Data will be ignored while routing.`
        : this.totalInvalid === 0
          ? 'Data looks good! You’re all set.'
          : '',

      imageSrc: this.totalInvalid === 0
        ? '../../../../assets/icons/icons_warning.svg'
        : '../../../../assets/icons/icons_check_circle.svg'
    }


  }




  downloadSample() {
    const link = document.createElement('a');
    link.href = 'assets/sample_shipments.xlsx';
    link.download = 'sample_shipments.xlsx';
    link.click();
  }

  onRowEditInit(row: any) {
    this.isEditable = true
    this.currentEditingRow = row;
    console.log(row);
  }

  onRowEditSave(row: any) {
    this.isEditable = false;
    this.validateData();
    this.messageService.add({ severity: 'info', summary: 'Saved Successfully', icon: 'pi pi-check' });
    this.currentEditingRow = null;
  }
  onRowEditCancel(row: any, index: any) {
    this.isEditable = false;
    this.currentEditingRow = null;
    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });

  }
  onHeaderCheckboxToggle(headCheckBox: any) {
    if (headCheckBox.checked == true) {
      this.showActions = false;
    } else if (headCheckBox.checked == false) {
      this.showActions = true;
    }
  }
  onRowSelect(event: TableRowSelectEvent) {
    console.log(event, '122')
    if (this.selectedItems.length === this.rows.length) {
      this.showActions = false;
    }
  }
  onRowUnselect(event: TableRowUnSelectEvent) {
    console.log(event, '122')
    this.showActions = true;
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: `Do you want to delete ${this.selectedItems.length} rows? `,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.rows = this.rows.filter(row => !this.selectedItems.some((selected: { shipment_id: string; }) => selected.shipment_id === row.shipment_id));
        this.selectedItems = [];
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Rows deleted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    })
  }

  validateRow(item: any): boolean {
    return item.shipment_id && item.external_id && item.address;
  }

  deleteOrder(event: any) {
    console.log(event, '122')
    this.confirmationService.confirm({
      message: 'Do you want to delete this row?',
      header: 'Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      accept: () => {
        this.rows = this.rows.filter(item => item.shipment_id !== event.shipment_id);

        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Row deleted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }


  onCancel() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';  // Reset the file input
    }
    this.rows = [];
    this.headers = []
  }

  onSourceChange(event: DropdownChangeEvent) {
    console.log(event, this.selectedSource, '122')
    this.headers = []
    this.rows = []
    if (this.selectedSource === 'upload') {
      console.log('Upload File selected');
    } else if (this.selectedSource === 'fetch') {
      console.log('Fetch from Database selected');
    }
  }

  async fetchDataFromDB() {

    this.appendDataToTable()
  }
  async appendDataToTable() {

    this.validateData()
  }
  async onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    this.rows = [];
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.headers = rows[0];
      this.headers = [...this.headers, 'status']
      this.rows = rows.slice(1).map((row: any) => {
        const obj: any = {};
        row.forEach((cell: any, index: number) => {
          obj[this.headers[index]] = cell;
        });
        return obj;
      });
      this.loading = false;
      this.appendDataToTable();

    };
    reader.readAsBinaryString(target.files[0]);
  }

  async onSubmit() {
    if (this.rows.length > 0) {
      await this.submitData(this.rows);
    }
  }

  async submitData(rows: any[]) {
    const sanitizedRows = rows.reduce((acc, col) => {
      if (col['status']) {
        const { status, latitude, longitude, weight, ...rest } = col;

        const sanitizedRow = {
          ...rest,
          latitude: typeof latitude === 'string' ? parseInt(latitude, 10) : latitude,
          longitude: typeof longitude === 'string' ? parseInt(longitude, 10) : longitude,
          weight: typeof weight === 'string' ? parseInt(weight, 10) : weight
        };

        acc.push(sanitizedRow);
      }
      return acc;
    }, []);

    const mutation = gql`
      mutation CreateShipment($data: [CustomTouchPointInput!]!) {
        create_shipments(data: $data)
      }
    `;

    try {
      const res = await this.graphqlService.runMutation(mutation, { data: sanitizedRows });
      console.log(res);
      this.goToConfiguration.emit(res.create_shipments);
      this.dataForMarker.emit(rows);
    } catch (error) {
      console.error('GraphQL Error:', error);
    }
  }


  uploadData(): void {
    this.dialogRef = this.dialogService.open(UploadDataFileComponent, {
      header: 'Upload Data File',
      width: '60vw',
      styleClass: 'data_upload',
    });

    this.dialogRef.onClose.subscribe((file: File) => {
      if (file) {
        this.onFileChange({ target: { files: [file] } });
      } else {
        console.log('Dialog was closed without file upload');
      }
    });
  }
}
