import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { EmergenciesService } from 'src/services/emergensies.service';
import { Emergency } from 'src/models/emergency.model';
import { Marker } from 'src/models/marker.model';
import { MatDialog } from '@angular/material';
import { EmergencyDetailComponent } from '../emergency-detail/emergency-detail.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 2, rows: 1 },
        ];
      }
      return [
        { title: 'Card 1', cols: 2, rows: 2 },
      ];
    })
  );


  emergencies: Emergency[] = []
  markers: Marker[] = []

  cityLatitude = 50.061650;
  cityLongitude = 19.938444;
  openedWindow : number = 0; // alternative: array of numbers
  constructor(private breakpointObserver: BreakpointObserver, private emergenciesService: EmergenciesService, public dialog: MatDialog) {
    emergenciesService.getEmergensiesAll().subscribe(emergencies => {
      this.emergencies = emergencies;
      this.markers = emergencies.map(element => {
        let newMarker = new Marker()
        newMarker.id = element.id;
        newMarker.latitude = element.latitude;
        newMarker.longitude = element.longitude;
        newMarker.info = element.info;
        return newMarker
      })
    })
  }

  openMarkerDetail(id: string) {
    let emergency = this.emergencies.find(element => {
      return element.id == id
    })
    const dialogRef = this.dialog.open(EmergencyDetailComponent, 
      { 
        width: '1000px', 
        height: '650px',
        data: emergency
      });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openWindow(id: number) {
      this.openedWindow = id; // alternative: push to array of numbers
  }
  
  isInfoWindowOpen(id: number) {
      return this.openedWindow == id; // alternative: check if id is in array
  }

}
