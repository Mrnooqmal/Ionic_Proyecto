import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonBreadcrumbs } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-crearFicha',
  templateUrl: './crearFicha.page.html',
  styleUrls: ['./crearFicha.page.scss'],
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonTextarea, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonBreadcrumbs]
})
export class CrearFichaPage implements OnInit {
  
  nombre: string = '';
  apellido: string = '';
  datosPaciente: string = '';
  examenes: string = '';
  consultas: string = '';
  diagnosticos: string = '';
  procedimientos: string = '';
  alergias: string = '';
  operaciones: string = '';
  medicamentos: string = '';
  habitos: string = '';

  constructor() {
    addIcons({ arrowBack });
  }

  ngOnInit() {
  }

  guardarFicha() {
    const nuevaFicha = {
      nombre: this.nombre,
      apellido: this.apellido,
      datosPaciente: this.datosPaciente,
      examenes: this.examenes,
      consultas: this.consultas,
      diagnosticos: this.diagnosticos,
      procedimientos: this.procedimientos,
      alergias: this.alergias,
      operaciones: this.operaciones,
      medicamentos: this.medicamentos,
      habitos: this.habitos
    };

    console.log('Guardando ficha:', nuevaFicha);
    
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.nombre = '';
    this.apellido = '';
    this.datosPaciente = '';
    this.examenes = '';
    this.consultas = '';
    this.diagnosticos = '';
    this.procedimientos = '';
    this.alergias = '';
    this.operaciones = '';
    this.medicamentos = '';
    this.habitos = '';
  }

}