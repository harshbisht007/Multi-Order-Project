import { Component, effect, EventEmitter, input, Input, OnChanges, OnInit, output, Output, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { TouchPoint, Zone } from "../../../graphql/generated";
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
  @Output() zoneForRouting: EventEmitter<any> = new EventEmitter()
  @Input() valueForTable: any[] = []
  @Input() readyZone: any;
  loading: boolean = false;
  headers: string[] = [];
  showActions: any = true;
  selectedSource: any = 'upload';
  sources: any;
  isEditable: boolean = false
  zones = this.zoneService.zones;
  zoneFromSynco: any;
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
  referencePoint: any[]=[]
  constructor(private zoneService: ZoneService, private graphqlService: GraphqlService,
    private confirmationService: ConfirmationService, private messageService: MessageService,
    public dialogService: DialogService,) {

  }

  ngOnInit() {
    this.zoneService.getZones().subscribe(
      (data) => {
        this.zoneFromSynco = data.data; // Handle the API response here
      },
      (error) => {
        console.error('Error fetching zones:', error); // Handle errors here
      }
    );

    if (this.readyZone) {
      this.selectedZone = this.readyZone.event.value;
    }
    if (this.valueForTable.length) {
      this.headers = Object.keys(this.valueForTable[0]);
      console.log(this.headers, '122')
      this.rows = this.valueForTable;
    }
    this.sources = [
      { name: 'Upload File', value: 'upload' },
      { name: 'Fetch from Database', value: 'fetch' }
    ];
  }

  async onZoneChange(event: DropdownChangeEvent) {
    console.log(this.selectedZone,'122')
    await this.removeFarOrders(event.value.geom.coordinates[0]);
    this.zoneForRouting.emit({ event, refrencePoint: this.referencePoint });
    if(!this.rows.length)
    this.selectedZone = {
      __typename: 'Zone',
      id: '',
      name: ''
    };
  }


  async removeFarOrders(zonePoints: any) {
    this.referencePoint=[0,0]
    this.referencePoint = this.getZoneMeanPoint(zonePoints);
    console.log(this.referencePoint,'122')
    const distanceThreshold = 200;

    this.rows = this.rows.filter((order: CustomTouchPoint) => {
      if (order.latitude && order.longitude) {
        const distance = this.getStraightDistanceFromLatLonInKm(
          this.referencePoint[1], this.referencePoint[0],
          order.latitude, order.longitude
        );

        return distance <= distanceThreshold;
      } else {
        return true;
      }
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Orders Updated',
      detail: 'Far orders have been removed.'
    });
  }

  getZoneMeanPoint(arr: [number, number][]): [number, number] {
    let twoTimesSignedArea = 0;
    let cxTimes6SignedArea = 0;
    let cyTimes6SignedArea = 0;

    const length = arr.length;

    for (let i = 0; i < length; i++) {
      const [x0, y0] = arr[i];
      const [x1, y1] = arr[(i + 1) % length]; // Avoid recalculating the modulus

      const twoSA = x0 * y1 - x1 * y0; // Calculate signed area (two times)
      twoTimesSignedArea += twoSA;
      cxTimes6SignedArea += (x0 + x1) * twoSA;
      cyTimes6SignedArea += (y0 + y1) * twoSA;
    }

    const sixSignedArea = 3 * twoTimesSignedArea; // Final signed area calculation
    return [
      cxTimes6SignedArea / sixSignedArea,
      cyTimes6SignedArea / sixSignedArea,
    ];
  }

  deg2rad(deg: any) {
    return deg * (Math.PI / 180);
  }

  getStraightDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km

    // Convert lat/lon differences to radians in one step
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    // Precompute cosines and sines
    const lat1Rad = this.deg2rad(lat1);
    const lat2Rad = this.deg2rad(lat2);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);

    const a = sinDLat * sinDLat +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinDLon * sinDLon;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Return distance in kilometers
    return R * c;
  }



  validateData() {
    this.totalInvalid = 0;
    this.rows.forEach((obj: any) => {
      const hasComma = Object.keys(obj)
        .filter(key => key !== 'address')
        .some(key => typeof obj[key] === 'string' && obj[key].includes(','));
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
        ? `${this.totalInvalid} Rows invalid. Please correct it.`
        : this.totalInvalid === 0
          ? 'Data looks good! You’re all set.'
          : '',

      imageSrc: this.totalInvalid === 0
        ? '../../../../assets/icons/icons_warning.svg'
        : '../../../../assets/icons/icons_check_circle.svg'
    }
    
    console.log(this.rows, this.totalInvalid, '122')

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
    const query = gql`
    query List_shipment {
    list_touch_point {
      id
      routing_id(isNull: true)
      customer_name
      customer_phone
      geom {
        latitude
        longitude
      }
      shipment_id
      touch_point_status
      touch_point_type
      address
      external_id
      weight
      pincode
      opening_time
      closing_time
      category_type
    }
  }
  `;
    try {

      const res = await this.graphqlService.runQuery(query)
      if (res) {
        this.appendDataToTable()
      }
      console.log(res, '122')
    } catch (error) {
      console.error(error, '122')
    }

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
        const { status, latitude, longitude, weight, pincode, ...rest } = col;

        const sanitizedRow = {
          ...rest,
          latitude: typeof latitude === 'string' ? parseInt(latitude, 10) : latitude,
          longitude: typeof longitude === 'string' ? parseInt(longitude, 10) : longitude,
          weight: typeof weight === 'string' ? parseInt(weight, 10) : weight,
          pincode: typeof pincode === 'number' ? pincode.toString() : pincode
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
      this.dataForMarker.emit(rows);
      console.log(res);
      this.goToConfiguration.emit(res.create_shipments);
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
