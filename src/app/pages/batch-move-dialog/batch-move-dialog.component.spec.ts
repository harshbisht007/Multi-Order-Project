import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchMoveDialogComponent } from './batch-move-dialog.component';

describe('BatchMoveDialogComponent', () => {
  let component: BatchMoveDialogComponent;
  let fixture: ComponentFixture<BatchMoveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchMoveDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BatchMoveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
