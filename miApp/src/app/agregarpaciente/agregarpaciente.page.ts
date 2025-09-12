import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { PatientService, Patient } from '../services/patient';

@Component({
  selector: 'app-agregarpaciente',
  templateUrl: './agregarpaciente.page.html',
  styleUrls: ['./agregarpaciente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AgregarpacientePage implements OnInit {
  patient: Patient = {
    name: '',
    birthDate: '',
    email: '',
    phone: '',
    address: '',
    sex: '',
    nationality: '',
    occupation: '',
    prevision: '',
    bloodType: ''
  };

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    this.patientService.addPatient({ ...this.patient });
    this.router.navigate(['/pacientes']);
  }
}