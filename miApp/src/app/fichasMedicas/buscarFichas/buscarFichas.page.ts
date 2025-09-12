import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSearchbar, IonList } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, search, eye } from 'ionicons/icons';

interface FichaMedica {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  tipoSangre: string;
}

@Component({
  selector: 'app-buscar-fichas',
  templateUrl: './buscarFichas.page.html',
  styleUrls: ['./buscarFichas.page.scss'],
  standalone: true,
  imports: [RouterModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSearchbar, IonList]
})
export class BuscarFichasPage implements OnInit {
  
  rutBusqueda: string = '';
  busquedaRealizada: boolean = false;
  
  fichasEjemplo: FichaMedica[] = [
    { id: 1, nombre: 'Miguel', apellido: 'Torres', rut: '21.437.567-3', tipoSangre: 'AB-' },
    { id: 2, nombre: 'Maria', apellido: 'Rodriguez', rut: '18.234.567-8', tipoSangre: 'O+' },
    { id: 3, nombre: 'Pablo', apellido: 'Lopez', rut: '19.876.543-2', tipoSangre: 'A+' },
    { id: 4, nombre: 'Ana', apellido: 'Martinez', rut: '22.123.456-7', tipoSangre: 'B+' },
    { id: 5, nombre: 'Pedro', apellido: 'Gonzalez', rut: '17.987.654-3', tipoSangre: 'O-' }
  ];

  fichasFiltradas: FichaMedica[] = [];

  constructor(private router: Router) {
    addIcons({ arrowBack, search, eye });
  }

  ngOnInit() {
  }

  buscarPorNombre(event: any) {
    const texto = event.target.value.toLowerCase().trim();
    this.busquedaRealizada = true;

    if (texto === '') {
      this.fichasFiltradas = [];
      this.busquedaRealizada = false;
    } else {
      this.fichasFiltradas = this.fichasEjemplo.filter(ficha => 
        ficha.nombre.toLowerCase().includes(texto) || 
        ficha.apellido.toLowerCase().includes(texto)
      );
    }
  }

  buscarPorRut() {
    this.busquedaRealizada = true;

    if (this.rutBusqueda.trim() === '') {
      this.fichasFiltradas = [];
      this.busquedaRealizada = false;
    } else {
      this.fichasFiltradas = this.fichasEjemplo.filter(ficha => 
        ficha.rut.includes(this.rutBusqueda)
      );
    }
  }

  verFicha(fichaId: number) {
    console.log('Ver ficha ID:', fichaId);
    this.router.navigate(['/fichas/verFicha', fichaId]);
  }

  limpiarBusqueda() {
    this.rutBusqueda = '';
    this.fichasFiltradas = [];
    this.busquedaRealizada = false;
  }

}