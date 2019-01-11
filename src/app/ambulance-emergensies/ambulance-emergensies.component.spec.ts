import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';

import { AmbulanceEmergensiesComponent } from './ambulance-emergensies.component';

describe('AmbulanceEmergensiesComponent', () => {
  let component: AmbulanceEmergensiesComponent;
  let fixture: ComponentFixture<AmbulanceEmergensiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbulanceEmergensiesComponent ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceEmergensiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
