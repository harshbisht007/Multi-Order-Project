import {Component, EventEmitter, Output} from '@angular/core';
import {TouchPoint} from "../../../graphql/generated";
import {Table, TableModule} from "primeng/table";
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {MultiSelectModule} from "primeng/multiselect";
import {DropdownModule} from "primeng/dropdown";
import {TagModule} from "primeng/tag";
import {SliderModule} from "primeng/slider";
import * as XLSX from 'xlsx';
import {GraphqlService} from "../../../core/services/graphql.service";
import {gql} from "apollo-angular";
import {NgForOf} from "@angular/common";

export interface CustomTouchPoint extends TouchPoint {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-load-data',
  standalone: true,
  imports: [
    TableModule,
    Button,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    TagModule,
    SliderModule,
    NgForOf
  ],
  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.scss'
})
export class LoadDataComponent {
  rows!: CustomTouchPoint[];

  @Output() goToConfiguration: EventEmitter<string> = new EventEmitter();
  loading: boolean = false;
  headers: string[] = [];
  activityValues: number[] = [0, 100];

  searchValue: string | undefined;

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit() {

  }

  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    this.rows = [];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* Read the file */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* Get the first worksheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Save data */
      this.headers = rows[0]; // Extract the headers
      this.rows = rows.slice(1).map((row: any) => {
        const obj: any = {};
        row.forEach((cell: any, index: number) => {
          obj[this.headers[index]] = cell;
        });
        return obj;
      });

      console.log(this.rows);

      this.loading = false;
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
