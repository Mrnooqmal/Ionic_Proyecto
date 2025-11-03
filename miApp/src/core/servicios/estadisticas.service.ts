// src/app/core/servicios/estadisticas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseMysqlService } from './base_mysql.service';

export interface EstadisticasResumen {
  totalConsultas: number;
  consultasUltimoMes: number;
  totalAlergias: number;
  totalHabitos: number;
  totalVacunas: number;
  medicamentosActivos: number;
  recetasRecientes: number;
  totalMiembrosFamilia: number;
}

export interface UltimaConsulta {
  fecha: string;
  motivo: string;
  profesional: string;
}

export interface ConsultaPorMes {
  mes: string;
  total: number;
}

export interface EstadisticasPaciente {
  resumen: EstadisticasResumen;
  ultimaConsulta: UltimaConsulta | null;
  proximaConsulta: any | null;
  consultasPorMes: ConsultaPorMes[];
  tiposConsultaFrecuentes: any[];
}

export interface MetricaSalud {
  valor: any;
  unidad: string;
  estado: 'normal' | 'alerta' | 'critico';
  ultimaActualizacion: string;
}

export interface MetricasSalud {
  presionArterial: MetricaSalud;
  frecuenciaCardiaca: MetricaSalud;
  temperatura: MetricaSalud;
  peso: MetricaSalud;
  imc: MetricaSalud;
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService extends BaseMysqlService {

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Obtener estadísticas del paciente
   */
  getEstadisticasPaciente(idPaciente: number): Observable<EstadisticasPaciente> {
    return this.get<any>(`patients/${idPaciente}/estadisticas`).pipe(
      map(resp => resp?.data ?? this.getEstadisticasSimuladas()),
      catchError(err => {
        console.warn('Error obteniendo estadísticas, usando datos simulados', err);
        return of(this.getEstadisticasSimuladas());
      })
    );
  }

  /**
   * Obtener métricas de salud del paciente
   */
  getMetricasSalud(idPaciente: number): Observable<MetricasSalud> {
    return this.get<any>(`patients/${idPaciente}/metricas-salud`).pipe(
      map(resp => resp?.data ?? this.getMetricasSimuladas()),
      catchError(err => {
        console.warn('Error obteniendo métricas, usando datos simulados', err);
        return of(this.getMetricasSimuladas());
      })
    );
  }

  /**
   * Datos simulados para desarrollo
   */
  private getEstadisticasSimuladas(): EstadisticasPaciente {
    return {
      resumen: {
        totalConsultas: 12,
        consultasUltimoMes: 2,
        totalAlergias: 1,
        totalHabitos: 3,
        totalVacunas: 8,
        medicamentosActivos: 2,
        recetasRecientes: 3,
        totalMiembrosFamilia: 4
      },
      ultimaConsulta: {
        fecha: '15/10/2024',
        motivo: 'Control preventivo',
        profesional: 'Dr. Juan Pérez'
      },
      proximaConsulta: {
        fecha: '20/11/2024',
        motivo: 'Control de seguimiento',
        profesional: 'Dr. Juan Pérez'
      },
      consultasPorMes: [
        { mes: '2024-05', total: 1 },
        { mes: '2024-06', total: 2 },
        { mes: '2024-07', total: 1 },
        { mes: '2024-08', total: 3 },
        { mes: '2024-09', total: 2 },
        { mes: '2024-10', total: 3 }
      ],
      tiposConsultaFrecuentes: []
    };
  }

  private getMetricasSimuladas(): MetricasSalud {
    return {
      presionArterial: {
        valor: '120/80',
        unidad: 'mmHg',
        estado: 'normal',
        ultimaActualizacion: new Date().toISOString()
      },
      frecuenciaCardiaca: {
        valor: 72,
        unidad: 'bpm',
        estado: 'normal',
        ultimaActualizacion: new Date().toISOString()
      },
      temperatura: {
        valor: 36.6,
        unidad: '°C',
        estado: 'normal',
        ultimaActualizacion: new Date().toISOString()
      },
      peso: {
        valor: 70,
        unidad: 'kg',
        estado: 'normal',
        ultimaActualizacion: new Date().toISOString()
      },
      imc: {
        valor: 22.5,
        unidad: 'kg/m²',
        estado: 'normal',
        ultimaActualizacion: new Date().toISOString()
      }
    };
  }
}