import { Component, effect, ElementRef, EventEmitter, input, Input, OnChanges, OnInit, output, Output, SimpleChanges, ViewChild, viewChild } from '@angular/core';
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
import { ValidateTooltipPipe } from '../../../core/pipes/validate-tooltip.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ValidateColumnPipe } from '../../../core/pipes/validate-column.pipe';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadDataFileComponent } from '../../upload-data-file/upload-data-file.component';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { CreateShipmentService } from '../../../core/services/create-shipment.service';
import { FetchDatafromDBService } from '../../../core/services/fetch-datafrom-db.service';
import { RunRoutingService } from '../../../core/services/run-routing.service';
import { ReadyZone, ReadyZoneData } from '../../../graphql/interfaces/zoneData';
import { Header, ShipmentData } from '../../../graphql/interfaces/shipmentData';
import moment from 'moment';

export interface CustomValidObject {
  classes: { [key: string]: boolean };
  message: string;
  imageSrc: string;
}
interface CheckboxEvent {
  checked: boolean;
  originalEvent: Event;
}
export interface GeomOutlet {
  address: string;
  external_id: string;
  skip:boolean;
}

interface Geom {
  latitude: number;
  longitude: number;
}

export interface LatLngResponse {
  external_id: string;
  geom: Geom;
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
    ValidateTooltipPipe,
    SliderModule,
    ValidateColumnPipe,
    NgForOf,
    DialogModule,
    DynamicDialogModule
  ],
  providers: [ConfirmationService, MessageService, ZoneService, RunRoutingService, DialogService],

  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.scss'
})
export class LoadDataComponent implements OnInit {
  rows: ShipmentData[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; 
  originalData: ShipmentData | null = null;
  @Output() goToConfiguration: EventEmitter<number> = new EventEmitter();
  @Output() dataForMarker: EventEmitter<ShipmentData[]> = new EventEmitter();
  @Output() zoneForRouting: EventEmitter<ReadyZoneData> = new EventEmitter();
  @Input() valueForTable: ShipmentData[] = []
  @Input() readyZone!: ReadyZoneData;
  removedOrders: ShipmentData[] = [];

  loading: boolean = false;
  headers: any[] = [
    { field: 'shipment_id', header: 'Shipment Id' },
    { field: 'external_id', header: 'External Id' },
    { field: 'customer_name', header: 'Customer Name' },
    { field: 'customer_phone', header: 'Customer Number' },
    { field: 'category_type', header: 'Category Type' },
    { field: 'weight', header: 'Weight' },
    { field: 'address', header: 'Address' },
    { field: 'pincode', header: 'Pincode' },
    { field: 'opening_time', header: 'Opening Time' },
    { field: 'closing_time', header: 'Closing Time' },
    { field: 'touch_point_type', header: 'Touch Point Type' },
    { field: 'latitude', header: 'Latitude' },
    { field: 'longitude', header: 'Longitude' },
    { field: 'instructions', header: 'Instructions' },
    { field: 'mode_of_payment', header: 'Mode of Payment' },
    { field: 'total_amount', header: 'Total' },
    { field: 'status', header: 'Status' },

  ];
  selectedSource: string = 'upload';
  sources: Array<{ name: string; value: string }> = [];
  isEditable: boolean = false
  zones = this.zoneService.zones;
  zoneFromSynco!: ReadyZone[];
  selectedZone: Zone | null = null;
  selectedItems!: ShipmentData[];
  totalInvalid: number = 0;
  validColumnObject: CustomValidObject = {
    classes: {},
    message: '',
    imageSrc: ''
  }
  @Output() showSpinner: EventEmitter<boolean> = new EventEmitter();

  currentEditingRow: ShipmentData | null = null;
  dialogRef: DynamicDialogRef | undefined;
  refrencePoint: [number, number] = [0, 0]
  constructor(private zoneService: ZoneService, private graphqlService: GraphqlService, private runRouteService: RunRoutingService,
    private confirmationService: ConfirmationService, private messageService: MessageService, private fetchDataFromDBService: FetchDatafromDBService,
    public dialogService: DialogService, public createShipmentService: CreateShipmentService,
    private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    
    this.showSpinner.emit(false)
    this.zoneService.getZones().subscribe(
      (data) => {

        this.zoneFromSynco = data.data; 
        
      },
      (error) => {
        console.error('Error fetching zones:', error); // Handle errors here
      }
    );

    if (this.readyZone) {
      this.selectedZone = this.readyZone.event.value
      this.refrencePoint = this.readyZone.refrencePoint
    }
    if (this.valueForTable.length) {
      // this.headers = Object.keys(this.valueForTable[0]);
      this.rows = this.valueForTable;
    }
    this.sources = [
      { name: 'Upload File', value: 'upload' },
      { name: 'Fetch from Database', value: 'fetch' }
    ];
  }

  getFieldNames(headers: Array<{ field: string; header: string }>): string[] {
    return headers.map(item => item.field);  // Extract only the 'field' values
  }

  async onZoneChange(event: DropdownChangeEvent) {
    await this.removeFarOrders(event.value.geom.coordinates[0]);
    this.zoneForRouting.emit({ event, refrencePoint: this.refrencePoint });
    if (!this.rows.length)
      this.selectedZone = {
        __typename: 'Zone',
        id: '',
        name: ''
      };
  }

  async removeFarOrders(zonePoints: [number,number][]) {
    
    this.refrencePoint = this.getZoneMeanPoint(zonePoints);
    const distanceThreshold = 200;
    let farOrdersRemoved = false;


    this.rows = this.rows.filter((order: ShipmentData) => {
      if (order.latitude && order.longitude) {
        const distance = this.getStraightDistanceFromLatLonInKm(
          this.refrencePoint[1], this.refrencePoint[0],
          order.latitude, order.longitude
        );
        if (distance > distanceThreshold) {
          farOrdersRemoved = true;
          this.removedOrders.push(order);
          return false;
        }
      }
      return true;
    });

    if (farOrdersRemoved) {
      this.messageService.add({
        severity: 'error',
        summary: 'Far Orders Removed',
        detail: 'Orders beyond the threshold distance have been removed.'
      });

    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Order updated',
        detail: 'No orders were beyond the distance threshold.'
      });
    }
  }

  generateRemovedOrdersExcel() {
    if (this.removedOrders.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Please upload the data first', icon: 'pi pi-info-circle' });
      return;
    }
  
    const formattedData = this.removedOrders.map((order: ShipmentData) => {
      
      const formattedOrder: { [key: string]: string | number } = {};
  
      this.headers.forEach((header: Header) => {
        if (header.field !== 'status'&&header.field!=='geom'&&header.field!=='touch_point_status') {
          formattedOrder[header.header] = order[header.field];
        }
      });
  
      return formattedOrder;
    });
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    XLSX.writeFile(workbook, 'Removed Orders.xlsx');
  }


  getZoneMeanPoint(arr: [number, number][]): [number, number] {
    let twoTimesSignedArea = 0;
    let cxTimes6SignedArea = 0;
    let cyTimes6SignedArea = 0;

    const length = arr.length;

    for (let i = 0; i < length; i++) {
      const [x0, y0] = arr[i];
      const [x1, y1] = arr[(i + 1) % length];

      const twoSA = x0 * y1 - x1 * y0;
      twoTimesSignedArea += twoSA;
      cxTimes6SignedArea += (x0 + x1) * twoSA;
      cyTimes6SignedArea += (y0 + y1) * twoSA;
    }

    const sixSignedArea = 3 * twoTimesSignedArea;
    return [
      cxTimes6SignedArea / sixSignedArea,
      cyTimes6SignedArea / sixSignedArea,
    ];
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  getStraightDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;

    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const lat1Rad = this.deg2rad(lat1);
    const lat2Rad = this.deg2rad(lat2);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);

    const a = sinDLat * sinDLat +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinDLon * sinDLon;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  onRowEditInit(row: ShipmentData) {
    if (this.currentEditingRow && this.currentEditingRow !== row) {
      this.messageService.add({
        severity: 'warn',
        summary: 'You need to save or cancel the current editing before editing another row.',
        detail: 'You need to save or cancel the current editing before editing another row.'
      });
      return;
    }
    this.isEditable = true
    this.originalData = { ...row }
    this.currentEditingRow = row;
  }

  onRowEditSave(row: ShipmentData) {
    this.isEditable = false;
    this.validateData();
    this.messageService.add({ severity: 'info', summary: 'Saved Successfully', icon: 'pi pi-check' });
    this.currentEditingRow = null;
    }
    onRowEditCancel(row: ShipmentData, index: number) {
      this.isEditable = false;
      this.currentEditingRow = null;
      this.rows[index] = { ...this.originalData } as ShipmentData;
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
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
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Rows deleted' });
        this.validateData()
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'You have rejected' });
      }
    })
  }


  deleteOrder(event: ShipmentData) {
    
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

        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Rows deleted' });
        this.validateData()
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'You have rejected' });
      }
    });
  }


  onCancel() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';  // Reset the file input
    }
    this.messageService.add({ severity: 'error', summary: 'Cancelled' });

    this.removedOrders = []
    this.rows = [];
    this.selectedZone = null
    this.refrencePoint=[0,0];
    // this.headers = []
  }

  onSourceChange(event: DropdownChangeEvent) {
    // this.headers = []
    this.rows = []
    if (this.selectedSource === 'upload') {
    } else if (this.selectedSource === 'fetch') {
    }
  }

  async fetchDataFromDB() {
    try {
      this.loading = true;
      const res = await this.fetchDataFromDBService.fetchDataFromDB();
      
      const uniqueData = Array.from(
        res.list_touch_point.reduce((map: Map<string, ShipmentData>, obj: ShipmentData) => {
          if (!map.has(obj.shipment_id)) {
            map.set(obj.shipment_id, obj);
          }
          return map;
        }, new Map<string, ShipmentData>()).values()
      ) as ShipmentData[];  
  
      if (res.list_touch_point.length > 0) {
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        this.selectedZone = null;
        await this.appendDataToTable(uniqueData);
        await this.getLatLngForRow();
        await this.validateData(true);
        this.loading = false;
      } else {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Database is empty',
          icon: 'pi pi-info-circle',
        });
      }
    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }
  
  async appendDataToTable(newData: ShipmentData[]) {
    if (!this.rows || this.rows.length === 0) {
      this.rows = [...newData];
    } else {
      const uniqueKey = 'shipment_id';
      const existingIds = new Set(this.rows.map((row: ShipmentData) => row[uniqueKey]));

      newData.forEach((newRow: ShipmentData) => {
        const existingRow = this.rows.find((row: ShipmentData) => row[uniqueKey] === newRow[uniqueKey]);

        if (existingRow) {
          return;
        } else if (!existingIds.has(newRow[uniqueKey])) {
          this.rows.push(newRow);
        }
      });
    }

    this.rows = [...this.rows];

    this.rows.forEach((row: ShipmentData) => {
      if (!row.latitude || !row.longitude) {
        if (row.geom && row.geom.latitude && row.geom.longitude) {
          row['latitude'] = row.geom.latitude;
          row['longitude'] = row.geom.longitude;
        }
      }
    });

  }
  async onFileChange(event: any) {
    this.validColumnObject = { classes: {}, message: '', imageSrc: '' };
    this.removedOrders = [];
    this.loading = true;
  
    const target = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
  
    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const rows: string[][]  = XLSX.utils.sheet_to_json(
        XLSX.read(e.target?.result as ArrayBuffer, { type: 'binary' }).Sheets[
          XLSX.read(e.target?.result as ArrayBuffer, { type: 'binary' }).SheetNames[0]
        ], { header: 1 }
      );
  
  
      const headerMapping = rows[0].reduce((map: any, excelHeader: string, index: number) => {
        const matchedHeader = this.headers.find(
          (header) => header.header.toLowerCase() === excelHeader.toLowerCase()
        );
        if (matchedHeader) map[index] = matchedHeader.field;
        return map;
      }, {});
  
      const excelData = rows.slice(1).map((row) =>
        row.reduce((obj: any, cell: any, index: number) => {
          const headerField = headerMapping[index];
          if (headerField) obj[headerField] = this.parseCell(cell, rows[0][index]);
          return obj;
        }, {})
      );
  
      await this.appendDataToTable(excelData);
      await this.getLatLngForRow();
      await this.validateData(true);

      this.loading = false;
    };

    reader.readAsBinaryString(target.files[0]);
  }
  

  parseCell(cell: any, header: string): any {
    if (header.toLowerCase().includes('time')) {
      if (typeof cell === 'number' && cell >= 0 && cell < 1) {
        const totalSeconds = Math.round(cell * 86400); // Convert fractional day to seconds
        return [
          Math.floor(totalSeconds / 3600),
          Math.floor((totalSeconds % 3600) / 60),
          totalSeconds % 60,
        ]
          .map((unit) => unit.toString().padStart(2, '0'))
          .join(':');
      }
      return typeof cell === 'string' ? cell : null;
    }
    return cell;
  }

  async getLatLngForRow() {
    const payload = this.rows.map((row: ShipmentData) => {
      const skip = row['latitude'] && row['longitude'];
      return {
        skip: !!skip,
        external_id: typeof row?.external_id == 'number' ? row?.external_id.toString() : row.external_id,
        address: row.address,
      };
    });
    const rowsToFetchLatLng = payload.filter((p) => !p.skip);
    if (rowsToFetchLatLng.length > 0) {
      try {
        const apiResponse = await this.fetchLatLngFromApi(rowsToFetchLatLng);
        this.updateLatLngInRows(apiResponse);
      } catch (error) {
        console.error('Error fetching lat/lng from API', error);
      }
    }
  }

  async fetchLatLngFromApi(payload: GeomOutlet[]): Promise<{ external_id: string; lat: number; lng: number }[]> {
    try {
      const response = await this.runRouteService.fetchOrderLatLng(payload);
      
      const data: { external_id: string; lat: number; lng: number }[] | undefined = response?.response.map((row: LatLngResponse) => ({
        external_id: row.external_id,
        lat: row?.geom?.latitude,
        lng: row?.geom?.longitude,
      }));
      
      return data || [];
    } catch (error) {
      console.error('Error fetching lat/lng from API:', error);
      throw error;
    }
  }
  

  updateLatLngInRows(apiResponse: { external_id: string; lat: number; lng: number }[]): void {
    apiResponse.forEach((response) => {
      const rowToUpdate = this.rows.find((row) => row.external_id == response.external_id);
      if (rowToUpdate) {
        rowToUpdate.latitude = response.lat;
        rowToUpdate.longitude = response.lng;
      }
    });
  }
  
  async validateData(validateOnly?: boolean) {

    this.totalInvalid = 0;

    this.rows.forEach((obj: any) => {
      const hasComma = Object.keys(obj)
        .filter(key => key !== 'address')
        .some(key => typeof obj[key] === 'string' && obj[key].includes(','));

      const invalidTouchPointType = obj.touch_point_type !== 'PICKUP' && obj.touch_point_type !== 'DROP';

      const hasNullValue = Object.keys(obj)
        .filter(key => !['address', 'instructions', 'mode_of_payment', 'total_amount'].includes(key))
        .some(key => obj[key] === null || obj[key] === undefined || obj[key] === '');


      obj.status = hasComma || invalidTouchPointType || hasNullValue ? 'INVALID' : 'VALID';
    });


    this.totalInvalid = this.rows.filter((obj: ShipmentData) => obj.status === 'INVALID').length;

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
        : 'Data looks good! You’re all set.',

      imageSrc: this.totalInvalid === 0
        ? '../../../../assets/icons/icons_warning.svg'
        : '../../../../assets/icons/icons_check_circle.svg'
    };

    if (validateOnly) {

      this.messageService.add({ severity: 'success', summary: 'Data Upload Successfully' });
    }
  }


  async onSubmit(): Promise<void> {
    if (this.rows?.length) {
      const processedRows = this.rows.map(({ touch_point_status, geom, ...rest }) => rest);
      await this.submitData(processedRows);
    }
  }
  

  async submitData(rows: ShipmentData[]) {
    const sanitizedRows: ShipmentData[] = rows.reduce<ShipmentData[]>((acc, col) => {
      if (col['status']) {
        const {
          opening_time,
          closing_time,
          external_id,
          instructions,
          total_amount,
          latitude,
          longitude,
          weight,
          pincode,
          customer_phone,
          status,
          ...rest
        } = col;

        const sanitizedRow: ShipmentData = {
          ...rest,
          opening_time: typeof opening_time === 'number' ? opening_time.toString() : opening_time,
          closing_time: typeof closing_time === 'number' ? closing_time.toString() : closing_time,
          latitude: typeof latitude === 'string' ? parseFloat(latitude) : latitude,
          longitude: typeof longitude === 'string' ? parseFloat(longitude) : longitude,
          weight: typeof weight === 'string' ? parseFloat(weight) : weight,
          total_amount: typeof total_amount === 'string' ? parseFloat(total_amount) : total_amount,
          pincode: typeof pincode === 'number' ? pincode.toString() : pincode,
          external_id: typeof external_id === 'number' ? external_id.toString() : external_id,
          customer_phone: typeof customer_phone === 'number' ? customer_phone.toString() : customer_phone,
          instructions: typeof instructions === 'number' ? instructions.toString() : instructions,
          mode_of_payment: col.mode_of_payment,
        };

        acc.push(sanitizedRow);
      }
      return acc;
    }, []);

    try {

      const res = await this.createShipmentService.createShipments(sanitizedRows);
      this.dataForMarker.emit(rows);
      this.goToConfiguration.emit(res.create_shipments);
      this.updateQueryParams('route_id', res.create_shipments);

    } catch (error) {
      console.error('GraphQL Error:', error);
    }
  }

  updateQueryParams(paramName: string, paramValue: number) {
    
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { [paramName]: paramValue },
      queryParamsHandling: 'merge' 
    });
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
      }
    });
  }

  downloadTable() {
    if (this.rows.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Please upload the data first',
        icon: 'pi pi-info-circle',
      });
    } else {
      const filteredHeaders = this.headers.filter(
        (header) => header.field !== 'status'
      );
      const headerFields = filteredHeaders.map(
        (header) => header.field as keyof ShipmentData
      );
      const headerNames = filteredHeaders.map((header) => header.header);
  
      const data = this.rows.map((row) =>
        headerFields.reduce((acc, field) => {
          acc[field] = row[field]; 
          return acc;
        }, {} as Record<keyof ShipmentData, any>)
      );
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
        header: headerFields as string[],
      });
  
      XLSX.utils.sheet_add_aoa(worksheet, [headerNames], { origin: 'A1' });
  
      const workbook: XLSX.WorkBook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };

      XLSX.writeFile(workbook, 'Multi_Order_Report.xlsx');
    }
  }

}
