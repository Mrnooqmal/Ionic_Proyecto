import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PatientService, Patient } from '../services/patient';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.page.html',
  styleUrls: ['./pacientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class PacientesPage implements OnInit, OnDestroy {
  patients: Patient[] = [];
  private patientsSubscription: Subscription | undefined;

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.patientsSubscription = this.patientService.patients$.subscribe(patients => {
      this.patients = patients;
    });
  }

  ngOnDestroy() {
    if (this.patientsSubscription) {
      this.patientsSubscription.unsubscribe();
    }
  }
}