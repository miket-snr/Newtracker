import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingeditorComponent } from './fundingeditor.component';

describe('FundingeditorComponent', () => {
  let component: FundingeditorComponent;
  let fixture: ComponentFixture<FundingeditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundingeditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
