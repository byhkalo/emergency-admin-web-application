import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { EmergenciesDataSource, EmergenciesTableDS } from './emergencies-datasource';
import { EmergenciesService } from 'src/services/emergensies.service';
import { Emergency } from 'src/models/emergency.model';
import { EmergencyDetailComponent } from '../emergency-detail/emergency-detail.component';
import { MapDetailComponent } from '../map-detail/map-detail.component';
import { Marker } from 'src/models/marker.model';

@Component({
  selector: 'app-emergencies',
  templateUrl: './emergencies.component.html',
  styleUrls: ['./emergencies.component.css']
})
export class EmergenciesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: EmergenciesTableDS;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['latlong', 'time', 'info', 'isRequestedAmbulance', 'map'];

  constructor(public dialog: MatDialog, private emergenciesService: EmergenciesService) {}

  ngOnInit() {
    this.dataSource = new EmergenciesTableDS([], this.paginator, this.sort);
    this.emergenciesService.getEmergensiesAll().subscribe(emergenciesAll => {
      this.dataSource.data = emergenciesAll;
    });
  }
  dateTime(timestamp: number): string {
    let date = new Date(timestamp*1000)
    return date.toLocaleString()
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  createNewEmergency() {
    this.selectRow(null)
  }
  selectRow(row: Emergency | null) {
    const dialogRef = this.dialog.open(EmergencyDetailComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: row
      });
    
    dialogRef.afterClosed().subscribe(result => { });
  }
  showOnMap(row: Emergency) {
    let marker = new Marker()
    marker.id = row.id;
    marker.info = row.info;
    marker.latitude = row.latitude;
    marker.longitude = row.longitude;
    marker.iconUrl = marker.emergencyIcon
    const dialogRef = this.dialog.open(MapDetailComponent, 
      { 
        width: '800px', 
        height: '650px',
        data: marker
      });
    
    dialogRef.afterClosed().subscribe(result => { });
  }
}
