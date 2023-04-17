import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSitesComponent } from './multi-sites.component';

describe('MultiSitesComponent', () => {
  let component: MultiSitesComponent;
  let fixture: ComponentFixture<MultiSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
