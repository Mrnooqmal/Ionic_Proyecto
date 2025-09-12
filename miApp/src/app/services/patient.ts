import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Patient {
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  sex: string;
  nationality: string;
  occupation: string;
  prevision: string;
  bloodType: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientsSubject = new BehaviorSubject<Patient[]>([
    {
      name: 'John Doe',
      birthDate: '1990-01-01',
      email: 'john@example.com',
      phone: '123456789',
      address: '123 Street, City, Country',
      sex: 'Masculino',
      nationality: 'Estadounidense',
      occupation: 'Ingeniero',
      prevision: 'Fonasa',
      bloodType: 'O+'
    }
  ]);

  patients$ = this.patientsSubject.asObservable();

  constructor() {}

  addPatient(patient: Patient) {
    const currentPatients = this.patientsSubject.getValue();
    this.patientsSubject.next([...currentPatients, patient]);
  }

  getPatients(): Patient[] {
    return this.patientsSubject.getValue();
  }
}