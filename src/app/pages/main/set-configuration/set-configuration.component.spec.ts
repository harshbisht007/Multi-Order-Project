import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetConfigurationComponent } from './set-configuration.component';

describe('SetConfigurationComponent', () => {
  let component: SetConfigurationComponent;
  let fixture: ComponentFixture<SetConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
