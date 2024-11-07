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
  rows: CustomTouchPoint[] = [];
  @ViewChild('fileInput') fileInput!: any;
  originalData: any = {}
  @Output() goToConfiguration: EventEmitter<string> = new EventEmitter();
  @Output() dataForMarker: EventEmitter<any> = new EventEmitter();
  @Output() zoneForRouting: EventEmitter<any> = new EventEmitter()
  @Input() valueForTable: any[] = []
  @Input() readyZone: any;
  removedOrders: CustomTouchPoint[] = [];

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
    { field: 'status', header: 'Status' },
    { field: 'instructions', header: 'Instructions' },
    { field: 'mode_of_payment', header: 'Mode of Payment' },
    { field: 'total_amount', header: 'Total' },
    { field: 'split_amount', header: 'Split' },

  ];
  showActions: any = true;
  selectedSource: any = 'upload';
  sources: any;
  isEditable: boolean = false
  zones = this.zoneService.zones;
  zoneFromSynco: any;
  selectedZone: Zone | null = null;
  selectedItems: any;
  totalInvalid: number = 0;
  validColumnObject: CustomValidObject = {
    classes: {},
    message: '',
    imageSrc: ''
  }
  currentEditingRow: any = null;
  dialogRef: DynamicDialogRef | undefined;
  referencePoint: any[] = []
  constructor(private zoneService: ZoneService, private graphqlService: GraphqlService, private runRouteService: RunRoutingService,
    private confirmationService: ConfirmationService, private messageService: MessageService, private fetchDataFromDBService: FetchDatafromDBService,
    public dialogService: DialogService, public createShipmentService: CreateShipmentService,
    private router: Router, private activatedRoute: ActivatedRoute) {

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
      this.referencePoint = this.readyZone.referencePoint
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

  async onZoneChange(event: DropdownChangeEvent) {
    await this.removeFarOrders(event.value.geom.coordinates[0]);
    this.zoneForRouting.emit({ event, refrencePoint: this.referencePoint });
    if (!this.rows.length)
      this.selectedZone = {
        __typename: 'Zone',
        id: '',
        name: ''
      };
  }

  async removeFarOrders(zonePoints: any) {
    this.referencePoint = this.getZoneMeanPoint(zonePoints);
    const distanceThreshold = 200;
    let farOrdersRemoved = false;


    this.rows = this.rows.filter((order: CustomTouchPoint) => {
      if (order.latitude && order.longitude) {
        const distance = this.getStraightDistanceFromLatLonInKm(
          this.referencePoint[1], this.referencePoint[0],
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

    const formattedData = this.removedOrders.map((order: any) => {
      const formattedOrder: any = {};
      this.headers.forEach(header => {
        if (header.field !== 'status') {
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

  onRowEditInit(row: any) {
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

  onRowEditSave(row: any) {
    this.isEditable = false;
    this.validateData();
    this.messageService.add({ severity: 'info', summary: 'Saved Successfully', icon: 'pi pi-check' });
    this.currentEditingRow = null;
  }
  onRowEditCancel(row: any, index: any) {
    this.isEditable = false;
    this.currentEditingRow = null;
    this.rows[index] = { ...this.originalData };
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
    if (this.selectedItems.length === this.rows.length) {
      this.showActions = false;
    }
  }
  onRowUnselect(event: TableRowUnSelectEvent) {
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
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Rows deleted' });
        this.validateData()
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Not Deleted', detail: 'You have rejected' });
      }
    })
  }

  validateRow(item: any): boolean {
    return item.shipment_id && item.external_id && item.address;
  }

  deleteOrder(event: any) {
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
      const res = await this.fetchDataFromDBService.fetchDataFromDB();
      if (res.list_touch_point.length > 0) {
        this.loading = true;
        this.appendDataToTable(res.list_touch_point)
      } else {
        this.messageService.add({ severity: 'error', summary: 'Database is empty', icon: 'pi pi-info-circle' });

      }
    } catch (error) {
      console.error(error)
    }

  }
  async appendDataToTable(newData: any) {
    if (this.rows && this.rows.length > 0) {
      this.removedOrders = []
      const uniqueKey = 'external_id';
      const existingIds = new Set(this.rows.map((row: any) => row[uniqueKey]));

      newData.forEach((newRow: any) => {
        if (!existingIds.has(newRow[uniqueKey])) {
          this.rows.push(newRow);
        } else {
          const existingRow = this.rows.find((row: any) => row[uniqueKey] === newRow[uniqueKey]);

          if (existingRow) {
            Object.assign(existingRow, newRow);
          }
        }
      });
    } else {
      this.rows = [...newData];
    }

    this.validateData(true);

  }
  async onFileChange(event: any) {
    this.validColumnObject = {
      classes: {},
      message: '',
      imageSrc: ''
    }


    this.loading = true;
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

      const excelHeaders: string[] = rows[0];
      const headerMapping: any = {};

      excelHeaders.forEach((excelHeader: string, index: number) => {
        const matchedHeader = this.headers.find((header: any) => header.header.toLowerCase() === excelHeader.toLowerCase());
        if (matchedHeader) {
          headerMapping[index] = matchedHeader.field;
        }
      });

      this.rows = rows.slice(1).map((row: any) => {
        const obj: any = {};
        Object.values(headerMapping).forEach((headerField: any) => {
          obj[headerField] = null;
        });
        row.forEach((cell: any, index: number) => {
          const headerField = headerMapping[index];
          if (headerField) {
            obj[headerField] = cell !== undefined ? cell : null;
          }
        });
        return obj;
      });
      const payload = this.rows.map((row: any) => {
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
          const apiResponse: any = await this.fetchLatLngFromApi(rowsToFetchLatLng);
          this.updateLatLngInRows(apiResponse);
        } catch (error) {
          console.error('Error fetching lat/lng from API', error);
        }
      }
      this.appendDataToTable(this.rows);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  async fetchLatLngFromApi(payload: any[]): Promise<any[]> {
    try {
      const response = await this.runRouteService.fetchOrderLatLng(payload);
      const data = response?.response.map((row: any) => ({
        external_id: row.external_id,
        lat: row?.geom?.latitude,
        lng: row?.geom?.longitude,
      }));
      return data;
    } catch (error) {
      console.error('Error fetching lat/lng from API:', error);
      throw error;
    }
  }


  updateLatLngInRows(apiResponse: any[]) {
    apiResponse.forEach((response) => {
      const rowToUpdate = this.rows.find((row) => row.external_id == response.external_id);
      if (rowToUpdate) {
        rowToUpdate['latitude'] = response.lat;
        rowToUpdate['longitude'] = response.lng;
      }
    });
  }

  validateData(validateOnly?: boolean) {
    this.totalInvalid = 0;

    this.rows.forEach((obj: any) => {
      const hasComma = Object.keys(obj)
        .filter(key => key !== 'address')
        .some(key => typeof obj[key] === 'string' && obj[key].includes(','));

      const invalidTouchPointType = obj.touch_point_type !== 'PICKUP' && obj.touch_point_type !== 'DROP';

      const hasNullValue = Object.keys(obj)
        .filter(key => key !== 'address')
        .some(key => obj[key] === null || obj[key] === undefined || obj[key] === '');

      obj.status = hasComma || invalidTouchPointType || hasNullValue ? 'INVALID' : 'VALID';
    });


    this.totalInvalid = this.rows.filter((obj: any) => obj.status === 'INVALID').length;

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

    this.loading = false;
    if (validateOnly) {

      this.messageService.add({ severity: 'success', summary: 'Data Upload Successfully' });
    }
  }


  async onSubmit() {
    if (this.rows.length > 0) {
      await this.submitData(this.rows);
    }
  }

  async submitData(rows: any[]) {
    const sanitizedRows = rows.reduce((acc, col) => {
      if (col['status']) {
        const { opening_time, closing_time, total, external_id, total_amount,status, split_amount, latitude, longitude, weight, pincode, customer_phone, ...rest } = col;

        const sanitizedRow = {
          ...rest,
          opening_time: typeof opening_time == 'number' ? opening_time.toString() : opening_time,
          closing_time: typeof closing_time == 'number' ? closing_time.toString() : closing_time,
          latitude: typeof latitude === 'string' ? parseInt(latitude, 10) : latitude,
          longitude: typeof longitude === 'string' ? parseInt(longitude, 10) : longitude,
          weight: typeof weight === 'string' ? parseInt(weight, 10) : weight,
          total_amount: typeof total_amount === 'string' ? parseFloat(total_amount) : total_amount,
          split_amount: typeof split_amount === 'string' ? parseFloat(split_amount) : split_amount,
          pincode: typeof pincode === 'number' ? pincode.toString() : pincode,
          external_id: typeof external_id === 'number' ? external_id.toString() : external_id,
          customer_phone: typeof customer_phone === 'number' ? customer_phone.toString() : customer_phone,
          total: typeof total === 'number' ? total.toString() : total,


        };

        acc.push(sanitizedRow);
      }
      return acc;
    }, []);



    try {
      const res = await this.createShipmentService.createShipments(sanitizedRows)
      this.dataForMarker.emit(rows);
      this.goToConfiguration.emit(res.create_shipments);
      this.updateQueryParams('route_id', res.create_shipments);

    } catch (error) {
      console.error('GraphQL Error:', error);
    }
  }

  updateQueryParams(paramName: any, paramValue: any) {
    // Query params ko update karenge
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { [paramName]: paramValue },
      queryParamsHandling: 'merge'  // Existing query params ko preserve karna
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
      this.messageService.add({ severity: 'error', summary: 'Please upload the data first', icon: 'pi pi-info-circle' });
    } else {
      const data = this.rows;

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      const workbook: XLSX.WorkBook = {
        Sheets: { 'data': worksheet },
        SheetNames: ['data']
      };

      XLSX.writeFile(workbook, 'Multi_Order_Report.xlsx');
    }
  }

}
