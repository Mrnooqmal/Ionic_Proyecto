import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonText } from '@ionic/angular/standalone';
import { IonBreadcrumb, IonBreadcrumbs } from '@ionic/angular/standalone';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.page.html',
  styleUrls: ['./calculadora.page.scss'],
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
    CommonModule,
    FormsModule,
    IonBreadcrumb, 
    IonBreadcrumbs
  ]
})
export class CalculadoraPage implements OnInit {
  num1: number | null = null;
  num2: number | null = null;
  operation: string | null = null;
  result: number | null = null;
  errorMessage: string | null = null;

  constructor() { }

  ngOnInit() { }

  calculate() {
    this.result = null;
    this.errorMessage = null;

    if (this.num1 === null || this.num2 === null || this.operation === null) {
      this.errorMessage = 'Por favor, ingrese ambos números y seleccione una operación.';
      return;
    }

    switch (this.operation) {
      case 'sum':
        this.result = this.num1 + this.num2;
        break;
      case 'subtract':
        this.result = this.num1 - this.num2;
        break;
      case 'multiply':
        this.result = this.num1 * this.num2;
        break;
      case 'divide':
        if (this.num2 === 0) {
          this.errorMessage = 'No se puede dividir por cero.';
          return;
        }
        this.result = this.num1 / this.num2;
        break;
      default:
        this.errorMessage = 'Operación no válida.';
    }
  }
}