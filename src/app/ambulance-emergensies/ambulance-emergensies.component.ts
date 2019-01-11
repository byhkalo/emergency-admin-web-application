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
    console.log('Emergency Init 1')
    this.dataSource = new AmbulanceEmergensiesTableDS([], this.paginator, this.sort);
    console.log('Emergency Init 2')
    this.emergenciesService.getAmbulancedEmerg().subscribe(emergenciesAll => {
      console.log('getEmergensiesAll emit')
      this.dataSource.data = emergenciesAll;
    });
    console.log('Emergency Init 3')
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

    const dialogRef = this.dialog.open(MapDetailComponent, 
      { 
        width: '800px', 
        height: '650px',
        data: marker
      });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  acceptAmbulance(row: Emergency) {
    this.emergenciesService.setAmbulanceCompletedEmergency(row, true)
  }
}
