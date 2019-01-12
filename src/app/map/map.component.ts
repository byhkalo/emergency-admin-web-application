import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { EmergenciesService } from 'src/services/emergensies.service';
import { Emergency } from 'src/models/emergency.model';
import { Marker } from 'src/models/marker.model';
import { MatDialog } from '@angular/material';
import { EmergencyDetailComponent } from '../emergency-detail/emergency-detail.component';
import { PolicemansService } from 'src/services/policemans.service';
import { Policeman } from 'src/models/policeman.model';
import { PolicemanDetailComponent } from '../policeman-detail/policeman-detail.component';

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


  markerType = 0;

  emergencies: Emergency[] = []
  emergencyMarkers: Marker[] = []

  policemans: Policeman[] = []
  policemanMarkers: Marker[] = []
  markers: Marker[] = []

  cityLatitude = 50.061650;
  cityLongitude = 19.938444;
  openedWindow : number = 0; // alternative: array of numbers
  constructor(private breakpointObserver: BreakpointObserver, private emergenciesService: EmergenciesService,
    private policemansService: PolicemansService, public dialog: MatDialog) {
    emergenciesService.getEmergensiesAll().subscribe(emergencies => {
      this.emergencies = emergencies;
      this.emergencyMarkers = emergencies.map(element => {
        let newMarker = new Marker()
        newMarker.id = element.id;
        newMarker.latitude = element.latitude;
        newMarker.longitude = element.longitude;
        newMarker.info = element.info;
        newMarker.iconUrl = newMarker.emergencyIcon
        return newMarker
      })
      if (this.markerType == 0) {
        this.markers = this.emergencyMarkers
      } else if (this.markerType == 2) {
        this.markers = this.emergencyMarkers.concat(this.policemanMarkers)
      }
    })
    policemansService.getPolicemansAll().subscribe(policemans => {
      this.policemans = policemans;
      this.policemanMarkers = policemans.map(element => {
        let newMarker = new Marker()
        newMarker.id = element.id;
        newMarker.latitude = element.latitude;
        newMarker.longitude = element.longitude;
        newMarker.info = element.userFirstName + " " + element.userLastName;
        newMarker.iconUrl = newMarker.policeIcon
        return newMarker
      })
      if (this.markerType == 1) {
        this.markers = this.policemanMarkers
      } else if (this.markerType == 2) {
        this.markers = this.emergencyMarkers.concat(this.policemanMarkers)
      }
    })
  }

  openMarkerDetail(id: string) {
    let emergency = this.emergencies.find(element => {
      return element.id == id
    })
    let policeman = this.policemans.find(element => {
      return element.id == id
    })
    console.log("emergency = " + emergency)
    console.log("policeman = " + policeman)
    if (emergency != undefined) {
      const dialogRef = this.dialog.open(EmergencyDetailComponent, 
        { 
          width: '1000px', 
          height: '650px',
          data: emergency
        });
      dialogRef.afterClosed().subscribe(result => { });
    } else if (policeman != undefined) {
      const dialogRef = this.dialog.open(PolicemanDetailComponent, 
        { 
          width: '1000px', 
          height: '650px',
          data: policeman
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    
    
    
  }

  openWindow(id: number) {
      this.openedWindow = id; // alternative: push to array of numbers
  }
  
  isInfoWindowOpen(id: number) {
      return this.openedWindow == id; // alternative: check if id is in array
  }
  showEmergencies() {
    this.markerType = 0;
    this.markers = this.emergencyMarkers
  }
  showPolicemans() {
    this.markerType = 1;
    this.markers = this.policemanMarkers
  }
  showEmergAndPolicemans() {
    this.markerType = 2;
    this.markers = this.emergencyMarkers.concat(this.policemanMarkers)
  }
  iconForMarker(marker: Marker): string {
    return marker.iconUrl
  }
}
