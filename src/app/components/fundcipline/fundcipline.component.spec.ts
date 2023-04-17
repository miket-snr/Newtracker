import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundciplineComponent } from './fundcipline.component';

describe('FundciplineComponent', () => {
  let component: FundciplineComponent;
  let fixture: ComponentFixture<FundciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundciplineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
