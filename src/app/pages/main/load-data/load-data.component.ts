import { Component, effect, EventEmitter, Output, ViewChild, viewChild } from '@angular/core';
import { TouchPoint } from "../../../graphql/generated";
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
import { NgForOf } from "@angular/common";
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ValidateColumnPipe } from '../../../core/pipes/validate-column.pipe';
import { DialogModule } from 'primeng/dialog';

export interface CustomTouchPoint extends TouchPoint {
  latitude: number;
  longitude: number;
  status:Boolean

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
    NgForOf,
    ValidateColumnPipe,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService, ZoneService],

  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.scss'
})
export class LoadDataComponent {
  rows!: CustomTouchPoint[];
  @ViewChild('fileInput') fileInput!: any; 
  @Output() goToConfiguration: EventEmitter<string> = new EventEmitter();
  loading: boolean = false;
  headers: string[] = [];
  activityValues: number[] = [0, 100];
  showActions: any = true;
  searchValue: string | undefined;
  selectedSource: any = 'upload';
  sources: any;
  isEditable: boolean = false
  zones: any;
  selectedZone: any;
  selectedItems: any;
  globalFilterFields: string[] = [];
  totalInvalid : number = 0;
  showToastForValidCheck : boolean = false;
  validColumnObject = {
    classes : {},
    message : '',
    imageSrc : ''
  }

  visible: boolean = false;
  dontAskAgain: boolean = false;
  confirmationMessage: string = '';
  displayConfirmation: boolean = false;

  constructor(private zoneService: ZoneService, private graphqlService: GraphqlService, private confirmationService: ConfirmationService, private messageService: MessageService) {
    effect(() => {
      this.zones = this.zoneService.zones();
      if (this.zones && this.zones.length > 0) {
        console.log('Zones available: ', this.zones);
      }
    });
  }

  ngOnInit() {
    this.sources = [
      { name: 'Upload File', value: 'upload' },
      { name: 'Fetch from Database', value: 'fetch' }
    ];
  }

  onZoneChange(event: DropdownChangeEvent) {
    console.log(event, this.selectedZone, '122')
  }
  async validateData(){
    this.rows.map((obj : any)=>{
      const hasComma = Object.values(obj).some(value => typeof value === 'string' && value.includes(','));
      obj.status = hasComma ? 'INVALID' : 'VALID'
    })

    this.showToastForValidCheck = true;

    this.rows.map((obj : any)=>{
      if(obj.status === 'INVALID') {
        this.totalInvalid += 1;
      }
    })


    this.validColumnObject = {
      classes : {
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
    
      message : this.totalInvalid > 0
        ? `${this.totalInvalid} Rows invalid. Data will be ignored while routing.`
        : this.totalInvalid === 0
        ? 'Data looks good! You’re all set.'
        : '',
    
      imageSrc : this.totalInvalid === 0
      ? '../../../../assets/icons/icons_warning.svg'
        : '../../../../assets/icons/icons_check_circle.svg'
    }

    
  }


  hasComma(value: string): boolean {
    if (typeof value === 'string') {      
      return /,/.test(value);
    }
    return false;
  }


  downloadSample() {
    const link = document.createElement('a');
    link.href = 'assets/sample_shipments.xlsx';
    link.download = 'sample_shipments.xlsx';
    link.click();
  }

  onRowEditInit(arg0: any) {
    this.isEditable = true

    console.log(arg0, '122')

  }
  onRowEditSave(arg0: any) {
    this.isEditable = false
    this.messageService.add({ severity: 'info', summary: 'Saved Successfully', icon: 'pi pi-check' });

    console.log(arg0, '122')
  }
  onRowEditCancel(arg0: any, _t65: any) {
    this.isEditable = false
    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });

    console.log(arg0, _t65, '122')
  }
  onHeaderCheckboxToggle(arg0: any) {
    console.log(arg0, '122')
    if (arg0.checked == true) {
      this.showActions = false;
    } else if (arg0.checked == false) {
      this.showActions = true;
    }
  }
  onRowSelect(event: TableRowSelectEvent) {
    console.log(event, '122')
  }
  onRowUnselect(event: TableRowUnSelectEvent) {
    console.log(event, '122')
  }

  confirmDelete() {
    if (this.dontAskAgain) {
      this.executeDeletion();
      return;
    }
    this.confirmationMessage = `Do you want to delete ${this.selectedItems.length} rows?`;
    this.displayConfirmation = true;
  }
  onAccept() {
    this.executeDeletion();
    this.displayConfirmation = false;
  }

  onReject() {
    this.displayConfirmation = false;
    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
  }
  // Method to handle the deletion logic
  private executeDeletion() {
    this.rows = this.rows.filter(
      (row) =>
        !this.selectedItems.some(
          (selected: { shipment_id: string }) =>
            selected.shipment_id === row.shipment_id
        )
    );
    this.selectedItems = [];
    this.messageService.add({
      severity: 'info',
      summary: 'Rows deleted',
      detail: 'Rows deleted',
    });
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
    this.rows=[];
    this.headers=[]
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
      console.log(rows[0]);
      
      this.headers = rows[0];
      this.headers=[...this.headers,'status']
      this.rows = rows.slice(1).map((row: any) => {
        const obj: any = {};
        row.forEach((cell: any, index: number) => {
          obj[this.headers[index]] = cell;
        });
        return obj;
      });

      console.log(this.rows);

      this.loading = false;
      await this.validateData();
      console.log(this.globalFilterFields,'122')

    };
    reader.readAsBinaryString(target.files[0]);
  }

  async onSubmit() {
    if (this.rows.length > 0) {
      await this.submitData(this.rows);
    }
  }

  async submitData(rows: any[]) {
    const mutation = gql`mutation CreateShipment($data: [CustomTouchPointInput!]!) {
      create_shipments(data: $data)
    }`;

    try {
      const res = await this.graphqlService.runMutation(mutation, { data: rows });
      console.log(res);
      this.goToConfiguration.emit(res.create_shipments);
    } catch (error) {
      console.error('GraphQL Error:', error);
    }
  }
}
