import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonText, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.page.html',
  styleUrls: ['./conversor.page.scss'],
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
export class ConversorPage implements OnInit {
  monto: number | null = null;
  monedaOrigen: string | null = null;
  monedaDestino: string | null = null;
  resultado: number | null = null;
  mensajeError: string | null = null;
  equivalenciasUsd: { moneda: string, valor: number }[] = [];

  private tiposDeCambio: { [key: string]: number } = {
    'ARS': 1000,
    'EUR': 0.85,
    'CLP': 950
  };

  constructor(private controladorAlertas: AlertController) {}

  ngOnInit() {
    this.equivalenciasUsd = Object.keys(this.tiposDeCambio).map(moneda => ({
      moneda,
      valor: Math.round(this.tiposDeCambio[moneda] * 100) / 100
    }));
  }

  async convertir() {
    this.resultado = null;
    this.mensajeError = null;

    if (this.monto === null || this.monedaOrigen === null || this.monedaDestino === null) {
      this.mensajeError = 'Por favor, complete todos los campos.';
      return;
    }
    if (this.monto <= 0) {
      this.mensajeError = 'El monto debe ser mayor que cero.';
      return;
    }
    if (this.monedaOrigen === this.monedaDestino) {
      const alerta = await this.controladorAlertas.create({
        header: 'Advertencia',
        message: 'Las monedas de origen y destino no pueden ser iguales.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }

    let montoEnUsd: number;
    if (this.monedaOrigen === 'USD') {
      montoEnUsd = this.monto;
    } else {
      montoEnUsd = this.monto / this.tiposDeCambio[this.monedaOrigen];
    }

    if (this.monedaDestino === 'USD') {
      this.resultado = montoEnUsd;
    } else {
      this.resultado = montoEnUsd * this.tiposDeCambio[this.monedaDestino];
    }

    this.resultado = Math.round(this.resultado * 100) / 100;

    this.equivalenciasUsd = Object.keys(this.tiposDeCambio).map(moneda => ({
      moneda,
      valor: Math.round(this.tiposDeCambio[moneda] * 100) / 100
    }));
  }
}