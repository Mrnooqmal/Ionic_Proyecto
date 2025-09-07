import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonCheckbox, IonText } from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
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
    IonInput,
    IonButton,
    IonList,
    IonCheckbox,
    IonText,
    CommonModule,
    FormsModule,
    IonBreadcrumb, 
    IonBreadcrumbs
  ]
})
export class TareasPage implements AfterViewInit {
  nuevaTarea: string = '';
  tareas: { nombre: string, completada: boolean }[] = [];
  grafico: Chart | null = null;

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.actualizarGrafico();
  }

  agregarTarea() {
    if (this.nuevaTarea.trim()) {
      this.tareas.push({ nombre: this.nuevaTarea.trim(), completada: false });
      this.nuevaTarea = '';
      this.actualizarGrafico();
    }
  }

  eliminarTarea(indice: number) {
    this.tareas.splice(indice, 1);
    this.actualizarGrafico();
  }

  actualizarGrafico() {
    if (this.grafico) {
      this.grafico.destroy();
      this.grafico = null;
    }

    if (this.tareas.length === 0) {
      return;
    }

    const conteoCompletadas = this.tareas.filter(tarea => tarea.completada).length;
    const conteoNoCompletadas = this.tareas.length - conteoCompletadas;
    const porcentajeCompletadas = (conteoCompletadas / this.tareas.length) * 100;
    const porcentajeNoCompletadas = (conteoNoCompletadas / this.tareas.length) * 100;

    const contexto = (document.getElementById('graficoTareas') as HTMLCanvasElement)?.getContext('2d');
    if (contexto) {
      this.grafico = new Chart(contexto, {
        type: 'pie',
        data: {
          labels: ['Completadas', 'No Completadas'],
          datasets: [{
            data: [porcentajeCompletadas, porcentajeNoCompletadas],
            backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: 'top' },
            title: {
              display: true,
              text: 'Porcentaje de Tareas Completadas'
            }
          }
        }
      });
    }
  }
}