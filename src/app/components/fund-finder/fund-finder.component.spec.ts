import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundFinderComponent } from './fund-finder.component';

describe('FundFinderComponent', () => {
  let component: FundFinderComponent;
  let fixture: ComponentFixture<FundFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
