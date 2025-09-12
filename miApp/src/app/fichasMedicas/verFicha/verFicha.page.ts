import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonBadge } from '@ionic/angular/standalone';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, person, medical, document, create, print, clipboard, analytics, construct, warning, cut, fitness, cafe } from 'ionicons/icons';

interface FichaMedicaCompleta {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  tipoSangre: string;
  edad: number;
  examenes: string;
  consultas: string;
  diagnosticos: string;
  procedimientos: string;
  alergias: string;
  operaciones: string;
  medicamentos: string;
  habitos: string;
}

@Component({
  selector: 'app-verFicha',
  templateUrl: './verFicha.page.html',
  styleUrls: ['./verFicha.page.scss'],
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonBadge]
})
export class VerFichaPage implements OnInit {
  
  fichaId: string = '';
  
  ficha: FichaMedicaCompleta = {
    id: 1,
    nombre: 'Miguel',
    apellido: 'Torres',
    rut: '21.437.567-3',
    tipoSangre: 'AB-',
    edad: 35,
    examenes: 'Radiografia de torax\nExamen de sangre completo\nElectrocardiograma\nEcografia abdominal',
    consultas: 'Consulta sobre problemas respiratorios\nSeguimiento de presion arterial\nControl de rutina anual',
    diagnosticos: 'Hipertension arterial leve\nAsma bronquial controlada\nSobrepeso grado I',
    procedimientos: 'Biopsia de piel\nEndoscopia digestiva alta\nColonoscopia preventiva',
    alergias: 'Penicilina\nMariscos\nPolen de gramíneas',
    operaciones: 'Apendicectomia (2018)\nExtraccion de muelas del juicio (2020)',
    medicamentos: 'Enalapril 10mg - 1 vez al dia\nSalbutamol inhalador - segun necesidad\nOmeprazol 20mg - antes del desayuno',
    habitos: 'Ex fumador (dejo hace 3 años)\nConsumo ocasional de alcohol\nEjercicio regular 3 veces por semana\nDieta balanceada'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ 
      arrowBack, person, medical, document, create, print, 
      clipboard, analytics, construct, warning, cut, fitness, cafe 
    });
  }

  ngOnInit() {
    this.fichaId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Viendo ficha ID:', this.fichaId);
    this.cargarFicha();
  }

  cargarFicha() {
    console.log('Cargando ficha medica para ID:', this.fichaId);
  }

  editarFicha() {
    console.log('Editando ficha ID:', this.fichaId);
    this.router.navigate(['/fichas/editarFicha', this.fichaId]);
  }

  imprimirFicha() {
    console.log('Imprimiendo ficha ID:', this.fichaId);
    window.print();
  }

  volverAtras() {
    this.router.navigate(['/fichas/buscarFichas']);
  }

}