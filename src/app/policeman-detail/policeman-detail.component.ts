import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Policeman } from 'src/models/policeman.model';

@Component({
  selector: 'app-policeman-detail',
  templateUrl: './policeman-detail.component.html',
  styleUrls: ['./policeman-detail.component.css']
})
export class PolicemanDetailComponent implements OnInit {

  policeman: Policeman
  latitude: number;
  longitude: number;
  policemanId: string;
  userFirstName: string;
  userLastName: string;
  isAdmin: boolean;

  cityLatitude = 50.061650;
  cityLongitude = 19.938444;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Policeman, public dialogRef: MatDialogRef<PolicemanDetailComponent>) {
    this.policeman = data;
    this.latitude = this.policeman.latitude;
    this.longitude = this.policeman.longitude;
    this.policemanId = data.id;
    this.userFirstName = data.userFirstName;
    this.userLastName = data.userLastName;
    this.isAdmin = data.isAdmin;
   }

  ngOnInit() {
  }
  closePolicemanDetail() {
    this.dialogRef.close(true);
  }
}
