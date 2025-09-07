import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonText, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-inversiones',
  templateUrl: './inversiones.page.html',
  styleUrls: ['./inversiones.page.scss'],
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
    IonSelect,
    IonSelectOption,
    IonButton,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule,
    FormsModule,
    IonBreadcrumb, 
    IonBreadcrumbs
  ]
})
export class InversionesPage implements AfterViewInit {
  montoInicial: number | null = null;
  montoAdicional: number | null = null;
  frecuenciaAportes: 'mensual' | 'anual' | null = null;
  tasaInteres: number = 6;
  anos: number | null = null;
  valorFuturo: number | null = null;
  interesGanado: number | null = null;
  totalInvertido: number | null = null;
  mensajeError: string | null = null;
  grafico: Chart | null = null;
  datosAnuales: { ano: number, interes: number, saldo: number }[] = [];

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {}

  calcularInversion() {
    this.valorFuturo = null;
    this.interesGanado = null;
    this.totalInvertido = null;
    this.mensajeError = null;
    this.datosAnuales = [];
    if (this.grafico) {
      this.grafico.destroy();
      this.grafico = null;
    }

    if (this.montoInicial === null || this.montoAdicional === null || this.frecuenciaAportes === null || 
        this.tasaInteres <= 0 || this.anos === null) {
      this.mensajeError = 'Por favor, complete todos los campos con valores válidos.';
      console.log('Validación fallida:', { montoInicial: this.montoInicial, montoAdicional: this.montoAdicional, frecuenciaAportes: this.frecuenciaAportes, tasaInteres: this.tasaInteres, anos: this.anos });
      return;
    }
    if (this.montoInicial < 0 || this.montoAdicional < 0 || this.anos <= 0) {
      this.mensajeError = 'Los valores deben ser positivos.';
      console.log('Validación fallida: valores negativos o cero');
      return;
    }

    let saldo = this.montoInicial || 0;
    const tasaDiaria = this.tasaInteres / 100 / 365;
    let totalAnadido = saldo;
    let etiquetas: string[] = ['Año 0'];
    let datos: number[] = [saldo];
    this.datosAnuales.push({ ano: 0, interes: 0, saldo: saldo });

    console.log('Iniciando cálculo con:', { saldo, tasaDiaria, totalAnadido });

    for (let ano = 1; ano <= this.anos; ano++) {
      let saldoInicioAno = saldo;
      if (this.frecuenciaAportes === 'anual') {
        saldo += this.montoAdicional;
        totalAnadido += this.montoAdicional;
      }

      for (let dia = 1; dia <= 365; dia++) {
        saldo += saldo * tasaDiaria;
        if (this.frecuenciaAportes === 'mensual' && dia % 30 === 1 && dia <= 331) {
          saldo += this.montoAdicional;
          totalAnadido += this.montoAdicional;
        }
      }

      const contribucionesAno = this.frecuenciaAportes === 'anual' ? this.montoAdicional : this.frecuenciaAportes === 'mensual' ? 12 * this.montoAdicional : 0;
      const interesAno = saldo - saldoInicioAno - contribucionesAno;
      this.datosAnuales.push({ ano: ano, interes: Math.round(interesAno * 100) / 100, saldo: Math.round(saldo * 100) / 100 });

      etiquetas.push(`Año ${ano}`);
      datos.push(Math.round(saldo * 100) / 100);

      console.log(`Año ${ano}:`, { saldo: Math.round(saldo * 100) / 100, interes: Math.round(interesAno * 100) / 100, contribuciones: contribucionesAno });
    }

    this.valorFuturo = Math.round(saldo * 100) / 100;
    this.totalInvertido = totalAnadido;
    this.interesGanado = this.valorFuturo - this.totalInvertido;

    console.log('Resultados finales:', {
      valorFuturo: this.valorFuturo,
      totalInvertido: this.totalInvertido,
      interesGanado: this.interesGanado,
      datosAnuales: this.datosAnuales
    });

    this.inicializarGrafico(etiquetas, datos);
  }

  inicializarGrafico(etiquetas: string[], datos: number[]) {
    const contexto = (document.getElementById('graficoCrecimiento') as HTMLCanvasElement)?.getContext('2d');
    if (contexto) {
      this.grafico = new Chart(contexto, {
        type: 'line',
        data: {
          labels: etiquetas,
          datasets: [{
            label: 'Crecimiento del Capital',
            data: datos,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              text: 'Crecimiento del Capital a lo Largo de los Años'
            }
          }
        }
      });
    }
  }
}