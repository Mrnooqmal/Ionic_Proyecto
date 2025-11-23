import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseMysqlService } from './base_mysql.service';

export interface MetricasPaciente {
  totalConsultas: number;
  consultasUltimos30Dias: number;
  examenesPendientes: number; // Total de exámenes realizados
  medicamentosCronicos: number;
}

export interface UltimaConsulta {
  idConsulta: number;
  fecha: string;
  hora: string;
  nombreServicioSalud: string;
  nombreProfesional: string;
  especialidad: string;
}

export interface DiagnosticoReciente {
  idDiagnostico: number;
  nombreDiagnostico: string;
  fecha: string;
  nombreProfesional: string;
  gravedad: string;
}

export interface ExamenPendiente {
  idExamen: number;
  nombreExamen: string;
  fecha: string;
  estadoProceso: string;
  nombreServicioSalud: string;
}

export interface MedicamentoCronico {
  idMedicamento: number;
  nombreMedicamento: string;
  dosis: string;
  frecuencia: string;
  fechaInicio: string;
}

export interface DashboardPacienteStats {
  metricas: MetricasPaciente;
  ultimasConsultas: UltimaConsulta[];
  diagnosticosRecientes: DiagnosticoReciente[];
  examenesPendientes: ExamenPendiente[];
  medicamentosCronicos: MedicamentoCronico[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseMysqlService {

  /**
   * Obtiene las estadísticas completas del dashboard para un paciente específico
   */
  obtenerEstadisticasPaciente(idPaciente: number): Observable<DashboardPacienteStats> {
    return this.get<any>(`dashboard/paciente/${idPaciente}`).pipe(
      map(response => response.data)
    );
  }
}
