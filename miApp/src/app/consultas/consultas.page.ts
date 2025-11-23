import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonRefresher, IonRefresherContent, IonIcon,
  IonBadge, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar, time, medical, person, business } from 'ionicons/icons';
import { ConsultasService } from '../../core/servicios/consultas.service';

type ConsultaItem = {
  idConsulta: number;
  fechaIngreso: string;
  fechaEgreso?: string;
  hora?: string;
  motivo?: string;
  observacion?: string;
  condicionEgreso?: string;
  tipoConsulta?: string;
  servicio?: string;
  profesional?: string;
  especialidad?: string;
};

@Component({
  selector: 'app-consultas',
  standalone: true,
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonRefresher, IonRefresherContent, IonIcon,
    IonBadge, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton
  ]
})
export class ConsultasPage implements OnInit {
  cargando = true;
  error: string | null = null;
  consultas: ConsultaItem[] = [];
  idPaciente = 1; // simulación de sesión

  constructor(private consultasService: ConsultasService) {
    addIcons({ calendar, time, medical, person, business });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(event?: CustomEvent) {
    this.cargando = true;
    this.consultasService.getConsultasPaciente(this.idPaciente).subscribe({
      next: (lista: any[]) => {
        // Normalizar campos desde backend
        this.consultas = (lista || []).map((c: any) => ({
          idConsulta: c.idConsulta,
          fechaIngreso: c.fechaIngreso,
          fechaEgreso: c.fechaEgreso,
          hora: c.hora,
          motivo: c.motivo,
          observacion: c.observacion,
          condicionEgreso: c.condicionEgreso,
          tipoConsulta: c.tipoConsulta,
          servicio: c.servicio,
          profesional: c.profesional,
          especialidad: c.especialidad,
        }));
        this.error = null;
        this.cargando = false;
        event?.detail?.complete?.();
      },
      error: (err) => {
        this.error = 'No se pudieron obtener las consultas';
        console.error(err);
        this.cargando = false;
        event?.detail?.complete?.();
      }
    });
  }
}
