import { Injectable } from '@angular/core';
import { BaseMysqlService } from './base_mysql.service';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Medicamento {
  idMedicamento: number;
  nombreMedicamento: string;
  empresa?: string;
}

@Injectable({ providedIn: 'root' })
export class MedicamentosService extends BaseMysqlService {
  private medsSubject = new BehaviorSubject<Medicamento[]>([]);
  meds$ = this.medsSubject.asObservable();

  obtenerTodos(): Observable<Medicamento[]> {
    return this.get<Medicamento[]>('medicines'); // coincide con apiResource('medicines')
  }

  obtenerPorId(id: number) {
    return this.get<Medicamento>(`medicines/${id}`);
  }
}
