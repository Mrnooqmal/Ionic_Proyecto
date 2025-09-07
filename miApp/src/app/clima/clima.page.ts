import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonToggle, IonSegment, IonSegmentButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonToggle,
    IonSegment,
    IonSegmentButton,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule,
    FormsModule,
    IonBreadcrumb, 
    IonBreadcrumbs
  ]
})
export class ClimaPage implements AfterViewInit {
  esCelsius: boolean = true;
  ciudadSeleccionada: string = 'Santiago';
  datosClima: { ciudad: string, temperatura: number, condicion: string, humedad: number, viento: number, probabilidadLluvia: number } | null = null;
  grafico: Chart | null = null;

  private baseDatosClima: { [key: string]: { temperatura: number, condicion: string, humedad: number, viento: number, probabilidadLluvia: number } } = {
    'Santiago': { temperatura: 18, condicion: 'Soleado', humedad: 60, viento: 10, probabilidadLluvia: 20 },
    'Valparaíso': { temperatura: 15, condicion: 'Nublado', humedad: 80, viento: 15, probabilidadLluvia: 40 },
    'Concepción': { temperatura: 14, condicion: 'Lluvioso', humedad: 85, viento: 20, probabilidadLluvia: 60 }
  };

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.actualizarClima();
    this.inicializarGraficoLluvia();
  }

  actualizarClima() {
    const datos = this.baseDatosClima[this.ciudadSeleccionada];
    if (datos) {
      this.datosClima = {
        ciudad: this.ciudadSeleccionada,
        temperatura: this.esCelsius ? datos.temperatura : (datos.temperatura * 9/5) + 32,
        condicion: datos.condicion,
        humedad: datos.humedad,
        viento: datos.viento,
        probabilidadLluvia: datos.probabilidadLluvia
      };
    }
  }

  actualizarTemperatura() {
    this.actualizarClima();
  }

  inicializarGraficoLluvia() {
    const contexto = (document.getElementById('graficoLluvia') as HTMLCanvasElement)?.getContext('2d');
    if (contexto) {
      this.grafico = new Chart(contexto, {
        type: 'bar',
        data: {
          labels: Object.keys(this.baseDatosClima),
          datasets: [{
            label: 'Probabilidad de Lluvia (%)',
            data: Object.values(this.baseDatosClima).map(ciudad => ciudad.probabilidadLluvia),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              text: 'Probabilidad de Lluvia por Ciudad'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }
  }
}