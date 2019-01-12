import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Emergency, AmbulanceDetail } from 'src/models/emergency.model';
import { EmergenciesService } from 'src/services/emergensies.service';
import { PolicemansService } from 'src/services/policemans.service';
import { NotificationService } from 'src/services/notification.service';
import { Policeman } from 'src/models/policeman.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-emergency-detail',
  templateUrl: './emergency-detail.component.html',
  styleUrls: ['./emergency-detail.component.css']
})
export class EmergencyDetailComponent implements OnInit {
  emergency: Emergency
  isUpdate: boolean

  latitude: number;
  longitude: number;
  requestTime: string;
  additionalInfo: string; 
  requestPerson: string;
  isRequestedAmbulance: boolean;

  cityLatitude = 50.061650;
  cityLongitude = 19.938444;

  currentUser: Policeman | null = null

  constructor(@Inject(MAT_DIALOG_DATA) public data: Emergency | null, private emergenciesService: EmergenciesService, 
  private policemansService: PolicemansService, public dialogRef: MatDialogRef<EmergencyDetailComponent>,
  private notificationService: NotificationService, private authService: AuthService) { 
    this.emergency = data ? data : new Emergency();
    this.isUpdate = data != null;
    this.latitude = this.emergency.latitude;
    this.longitude = this.emergency.longitude;
    let date = new Date(this.emergency.timestamp);
    this.requestTime = date.toLocaleString();
    this.additionalInfo = this.emergency.info;
    let person = this.policemansService.getPolicemanById(this.emergency.requestPerson) 
    if (person == null) {
      this.requestPerson = "Admin"
    } else {
      this.requestPerson = person.userFirstName + " " + person.userLastName
    }
    if (this.isUpdate) {
      this.cityLatitude = this.latitude;
      this.cityLongitude = this.longitude;
    }
    this.isRequestedAmbulance = this.isUpdate ? this.emergency.ambulanceDetail.isRequested : false
    authService.getCurrentUserObservable().subscribe(tempUser => {
      this.currentUser = tempUser;
    })
  }

  ngOnInit() { }

  requestAmbulance() {
    this.isRequestedAmbulance = true
    this.emergenciesService.setRequestAmbulanceEmergency(this.emergency, true);
  }
  notifyPolicemans() {  
    let policemansIds: string[] = this.emergency.acceptedPolicemans.map(el=>{return el.id})
    let policemans = this.policemansService.getPolicemansByIds(policemansIds)
    this.notificationService.notifyPolicemans(policemans);
  }

  notifyPolicemansForNewEmerg(policemans: Policeman[]) {  
    this.notificationService.notifyPolicemans(policemans);
  }
  updateEmergency() {
    let ambulanceDetail: AmbulanceDetail = this.emergency.ambulanceDetail
    ambulanceDetail.isRequested = this.isRequestedAmbulance
    this.emergenciesService
    .updateEmergency(this.emergency, this.latitude, this.longitude, this.additionalInfo, 
      this.emergency.requestPerson, ambulanceDetail, this.emergency.acceptedPolicemans)
    this.dialogRef.close(true);
  }
  createNewEmergency() {
    if (this.latitude == undefined || this.longitude == undefined) {
      alert("Set Point on Map")
      return
    }
    let policemans = this.policemansService.policemansForEmergencyLocation(this.latitude, this.longitude, 5000)
    let policemansIds = policemans.map(el => {return el.id });
    let userId: string
    if (this.currentUser) {
      userId = "admin"
    } else {
      userId = this.currentUser.id
    }

    if (this.additionalInfo==undefined) { this.additionalInfo = "" }

    this.emergenciesService
    .createEmergency(this.latitude, this.longitude, this.additionalInfo, 
      userId, this.isRequestedAmbulance, policemansIds)
    this.notifyPolicemansForNewEmerg(policemans);
    this.dialogRef.close(true);
  }
  deleteEmergency() {
    this.emergenciesService.removeEmergency(this.emergency);
    this.dialogRef.close(true);
  }
  closeEmergency() {
    this.dialogRef.close(true);
  }
  mapClick(event) {
    if (!this.isUpdate) {
      this.latitude = event.coords.lat;
      this.longitude = event.coords.lng;
    }
  }
  withRequestAMB(eventCheck: any) {
    this.isRequestedAmbulance = eventCheck.checked;
  }
}
