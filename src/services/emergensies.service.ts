import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { Emergency, AmbulanceDetail, AcceptedPoliceman } from "src/models/emergency.model";
import * as firebase from 'firebase/app';
import 'firebase/database';


@Injectable({providedIn: 'root'})

export class EmergenciesService {
    
    private emergensiesAllObservable: BehaviorSubject<Array<Emergency>> = new BehaviorSubject([]);
    private emergensiesAllQuery: AngularFireList<Emergency>
    private ambulancedEmergObservable: BehaviorSubject<Array<Emergency>> = new BehaviorSubject([]);
    private ambulancedEmergQuery: AngularFireList<Emergency>

    constructor(private fireDatabase: AngularFireDatabase) {
        console.log('EmergenciesService')
        this.emergensiesAllQuery = fireDatabase.list<Emergency>('Emergency/collection');
        this.emergensiesAllQuery.valueChanges().subscribe(emergencies => {
            console.log('Get Emergencies')
            console.log(emergencies)
            this.emergensiesAllObservable.next(emergencies);
            let ambulanced = emergencies.filter(element => {
                return element.ambulanceDetail.isRequested == true
            })
            this.ambulancedEmergObservable.next(ambulanced);
        });
    }

    getEmergensiesAll(): BehaviorSubject<Array<Emergency>> {
        return this.emergensiesAllObservable;
    }
    getAmbulancedEmerg(): BehaviorSubject<Array<Emergency>> {
        return this.ambulancedEmergObservable;
    }
    // Unmanaged Orders
    createEmergency(latitude: number, longitude: number, info: string, requestPerson: string, 
        isRequestAmbulance: boolean, acceptedPolicemansIds: string[]) {
        
            console.log("Create Emergency")
            console.log("latitude = " + latitude)
            console.log("longitude = " + longitude)
            console.log("info = " + info)
            console.log("requestPerson = " + requestPerson)
            console.log("isRequestAmbulance = " + isRequestAmbulance)
            console.log("acceptedPolicemansIds = " + acceptedPolicemansIds)
        let ambulanceDetail: AmbulanceDetail = {isRequested: isRequestAmbulance, isCompleted: false};
        let acceptedPolicemans: AcceptedPoliceman[] = acceptedPolicemansIds.map(element => {
            return { id: element, isAccept: false };
        });
        var newEmerg = new Emergency();
        newEmerg.latitude = latitude;
        newEmerg.longitude = longitude;
        newEmerg.info = info;
        newEmerg.requestPerson = requestPerson;
        newEmerg.ambulanceDetail = ambulanceDetail;
        newEmerg.acceptedPolicemans = acceptedPolicemans;
        let date = new Date()
        newEmerg.timestamp = date.valueOf() / 1000;
        newEmerg.id = this.fireDatabase.createPushId()    
        this.emergensiesAllQuery.update(newEmerg.id, newEmerg);
    }
    updateEmergency(emergency: Emergency, latitude: number, longitude: number, info: string, requestPerson: string, ambulanceDetail: AmbulanceDetail, acceptedPolicemans: AcceptedPoliceman[]) {
        emergency.latitude = latitude;
        emergency.longitude = longitude;
        emergency.info = info;
        emergency.requestPerson = requestPerson;
        emergency.ambulanceDetail = ambulanceDetail;
        emergency.acceptedPolicemans = acceptedPolicemans;
        this.emergensiesAllQuery.update(emergency.id, emergency);
    }
    setRequestAmbulanceEmergency(emergency: Emergency, isRequested: boolean) {
        emergency.ambulanceDetail.isRequested = isRequested
        emergency.ambulanceDetail.isCompleted = false
        this.emergensiesAllQuery.update(emergency.id, emergency)
    }
    setAmbulanceCompletedEmergency(emergency: Emergency, isCompleted: boolean) {
        console.log("setAmbulanceCompletedEmergency")
        console.log("isCompleted " + isCompleted)
        if (emergency.ambulanceDetail.isRequested) {
            console.log("Try... ")
            emergency.ambulanceDetail.isCompleted = isCompleted
            this.emergensiesAllQuery.update(emergency.id, emergency)
            console.log("Updated")
        }
    }
    removeEmergency(emergency: Emergency) {
        this.emergensiesAllQuery.remove(emergency.id)
    }
}