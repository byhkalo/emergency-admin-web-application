import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicemanDetailComponent } from './policeman-detail.component';

describe('PolicemanDetailComponent', () => {
  let component: PolicemanDetailComponent;
  let fixture: ComponentFixture<PolicemanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicemanDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicemanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
