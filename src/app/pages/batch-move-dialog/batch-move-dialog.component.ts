import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GraphqlService } from '../../core/services/graphql.service';
import { ManageOrdersService } from '../../core/services/manage-orders.service';
@Component({
  standalone: true,
  selector: 'app-batch-move-dialog',
  templateUrl: './batch-move-dialog.component.html',
  imports: [DialogModule,
    DropdownModule,
    ButtonModule,
    FormsModule]
})
export class BatchMoveDialogComponent implements OnInit, OnChanges {
  @Input() display: boolean = false; // To control the dialog visibility
  @Input() touchPointId!: number;
  @Input() cluster: any; // Assuming 'cluster' contains the batches array
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>(); // Add this for two-way binding
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedBatch: any;
  batchOptions: { label: string, value: any }[] = [];

  constructor(private graphqlService: GraphqlService,private manageOrderService:ManageOrdersService) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.selectedBatch = null
    if (changes['cluster']) {
      const batches = changes['cluster']['currentValue'];
      const numberOfOptions = Math.max(0, batches.length - 1); 
    
      this.batchOptions = batches.slice(0, numberOfOptions).map((batch: any, index: number) => ({
        label: `Batch ${index + 1}`,
        value: batch.id
      }));
    }
    

  }
  ngOnInit(): void {
    this.selectedBatch = null;

  }

  onCancel(): void {
    this.display = false;
    this.displayChange.emit(this.display);  
    this.closeDialog.emit(false);
  }


  onMove(): void {
    if (this.selectedBatch) {
      this.moveTouchPointToBatch(this.selectedBatch.value, this.touchPointId);

    }

  }

  private async moveTouchPointToBatch(batchId: number, touchPointId: number): Promise<void> {
  
    try {
      const response=await this.manageOrderService.moveTouchPointToBatch(batchId,touchPointId)
      console.log('API Response:', response);
  
      // Assuming the response contains the necessary success information
      if (response) {
        console.log(`Touch point ${touchPointId} successfully moved to batch ${batchId}`);
  
        this.display = false;
        this.displayChange.emit(this.display);
        this.closeDialog.emit(true);
      } else {
        console.error('Failed to move touch point. Response:', response);
      }
    } catch (error) {
      console.error('GraphQL Error:', error);
    }
  }
  
}
