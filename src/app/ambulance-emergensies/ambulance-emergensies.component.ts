import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AmbulanceEmergensiesDataSource, AmbulanceEmergensiesTableDS } from './ambulance-emergensies-datasource';
import { Emergency } from 'src/models/emergency.model';
import { EmergenciesService } from 'src/services/emergensies.service';
import { MapDetailComponent } from '../map-detail/map-detail.component';
import { Marker } from 'src/models/marker.model';

@Component({
  selector: 'app-ambulance-emergensies',
  templateUrl: './ambulance-emergensies.component.html',
  styleUrls: ['./ambulance-emergensies.component.css']
})
export class AmbulanceEmergensiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: AmbulanceEmergensiesTableDS;

   /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['latlong', 'time', 'info', 'isAcceptedAmbulance', 'map'];

  constructor(public dialog: MatDialog, private emergenciesService: EmergenciesService) {}

  ngOnInit() {
    this.dataSource = new AmbulanceEmergensiesTableDS([], this.paginator, this.sort);
    this.emergenciesService.getAmbulancedEmerg().subscribe(emergenciesAll => {
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
  showOnMap(row: Emergency) {
    let marker = new Marker()
    marker.id = row.id;
    marker.info = row.info;
    marker.latitude = row.latitude;
    marker.longitude = row.longitude;
    marker.iconUrl = marker.emergencyIcon;
    const dialogRef = this.dialog.open(MapDetailComponent, 
      { 
        width: '800px', 
        height: '650px',
        data: marker
      });
    
    dialogRef.afterClosed().subscribe(result => { });
  }
  acceptAmbulance(row: Emergency) {
    this.emergenciesService.setAmbulanceCompletedEmergency(row, true)
  }
}
