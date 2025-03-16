import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GraphqlService } from '../../core/services/graphql.service';
import { ManageOrdersService } from '../../core/services/manage-orders.service';
import { Batch } from '../../graphql/interfaces/orderType';
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
  @Input() display: boolean = false;
  @Input() touchPointId!: number;
  @Input() cluster!: Batch[];
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeDialog: EventEmitter<{ success: boolean, selectedBatchIndex: number | null, selectedBatchId: number | null, additional_distance: number | null }> = new EventEmitter();
  selectedBatch!: { label: string; value: number; index: number; additional_distance: number } | null;
  batchOptions: { label: string, value: number }[] = [];

  constructor(private graphqlService: GraphqlService, private manageOrderService: ManageOrdersService) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.selectedBatch = null
    if (changes['cluster']) {
      const batches: Batch[] = changes['cluster']['currentValue'];

      const numberOfOptions = Math.max(0, batches.length - 1);
      this.batchOptions = batches
        .filter((batch) => !batch.is_missed)
        .slice(0, numberOfOptions)
        .map((batch, index) => ({
          label: `Batch ${batch.sequence_id}`,
          value: batch.id,
          index: index,
          additional_distance: batch.additional_distance
        }));

    }


  }
  ngOnInit(): void {
    this.selectedBatch = null;

  }

  onCancel(): void {
    this.display = false;
    this.displayChange.emit(this.display);
    this.closeDialog.emit({ success: false, selectedBatchIndex: null, selectedBatchId: null, additional_distance: null });
  }
 


  onMove(): void {
    if (this.selectedBatch) {
      this.moveTouchPointToBatch(this.selectedBatch.value, this.touchPointId, this.selectedBatch.index, this.selectedBatch.additional_distance);
    }

  }

  private async moveTouchPointToBatch(batchId: number, touchPointId: number, selectedBatchIndex: number, additional_distance: number): Promise<void> {

    try {
      const response = await this.manageOrderService.moveTouchPointToBatch(batchId, touchPointId)
      const missedBatch= this.cluster.find(cluster => cluster.is_missed);
      
      
      if (response) {

        this.display = false;
        this.displayChange.emit(this.display);
        // await this.manageOrderService.reRunBatching(missedBatch?.id)
        this.closeDialog.emit({ success: true, selectedBatchIndex: selectedBatchIndex, selectedBatchId: batchId, additional_distance: additional_distance });
      } else {
        console.error('Failed to move touch point. Response:', response);
      }
    } catch (error) {
      console.error('GraphQL Error:', error);
    }
  }

}
