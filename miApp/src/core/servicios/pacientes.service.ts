import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { BaseMysqlService } from './base_mysql.service';

export interface Paciente {
  idPaciente: number;
  nombrePaciente: string;
  fechaNacimiento: string;
  correo: string;
  telefono: string;
  direccion: string;
  sexo: string;
  nacionalidad: string;
  ocupacion: string;
  prevision: string;
  fotoPerfil?: string;
  tipoSangre: string;
  created_at: string;
  updated_at: string;
}

export interface FichaMedicaCompleta {
  paciente: Paciente;
  alergias: any[];
  habitos: any[];
  medicamentos: any[];
  consultas: any[];
  examenes: any[];
  diagnosticos: any[];
  procedimientos: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PacientesService extends BaseMysqlService {

  constructor(http: HttpClient) {
    super(http);
  }

  getPacientes(): Observable<Paciente[]> {
    return this.get<Paciente[]>('pacientes');
  }

  getPacienteById(id: number): Observable<Paciente> {
    console.log(`Obteniendo paciente ID: ${id}`);
    return this.get<Paciente>(`pacientes/${id}`);
  }

  crearPaciente(paciente: Omit<Paciente, 'idPaciente'>): Observable<Paciente> {
    console.log('Enviando paciente a MySQL API:', paciente);
    return this.post<Paciente>('pacientes', paciente);
  }

  actualizarPaciente(id: number, cambios: Partial<Paciente>): Observable<Paciente> {
    console.log(`Actualizando paciente ID ${id} en MySQL:`, cambios);
    return this.put<Paciente>(`pacientes/${id}`, cambios);
  }

  eliminarPaciente(id: number): Observable<void> {
    console.log(`Eliminando paciente ID ${id} de MySQL`);
    return this.delete<void>(`pacientes/${id}`);
  }

  getFichaMedicaCompleta(id: number): Observable<FichaMedicaCompleta> {
    console.log(`Obteniendo ficha completa para paciente ID: ${id}`);
    
    return new Observable(observer => {
      this.getPacienteById(id).subscribe({
        next: (pacienteReal) => {
          const fichaCompleta: FichaMedicaCompleta = {
            paciente: pacienteReal,
            alergias: this.getAlergiasSimuladas(id),
            habitos: this.getHabitosSimulados(id),
            medicamentos: this.getMedicamentosSimulados(id),
            consultas: this.getConsultasSimuladas(id),
            examenes: this.getExamenesSimulados(id),
            diagnosticos: this.getDiagnosticosSimulados(id),
            procedimientos: this.getProcedimientosSimulados(id)
          };
          observer.next(fichaCompleta);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  private getAlergiasSimuladas(pacienteId: number): any[] {
    const alergiasBase = [
      { idAlergia: 1, alergia: 'Penicilina', observacion: 'Reacción severa' },
      { idAlergia: 2, alergia: 'Mariscos', observacion: 'Urticaria' }
    ];
    return alergiasBase.slice(0, 2);
  }

  private getHabitosSimulados(pacienteId: number): any[] {
    return [
      { idHabito: 1, habito: 'Ejercicio', observacion: '3 veces por semana' },
      { idHabito: 2, habito: 'Alimentación', observacion: 'Dieta balanceada' }
    ];
  }

  private getMedicamentosSimulados(pacienteId: number): any[] {
    return [
      { idMedicamento: 1, nombreMedicamento: 'Enalapril 10mg', frecuencia: '1 vez al día' },
      { idMedicamento: 2, nombreMedicamento: 'Omeprazol 20mg', frecuencia: 'Antes del desayuno' }
    ];
  }

  private getConsultasSimuladas(pacienteId: number): any[] {
    return [
      { 
        idConsulta: 1, 
        motivo: 'Control de rutina anual', 
        fechaIngreso: '2024-01-15',
        profesional: 'Dr. Carlos López',
        diagnostico: 'Estado de salud general bueno'
      }
    ];
  }

  private getExamenesSimulados(pacienteId: number): any[] {
    return [
      { 
        idExamen: 1, 
        nombreExamen: 'Hemograma completo', 
        fecha: '2024-01-10',
        resultado: 'Dentro de rangos normales',
        valores: 'Hemoglobina: 14.2 g/dL'
      },
      { 
        idExamen: 2, 
        nombreExamen: 'Perfil lipídico', 
        fecha: '2024-01-10',
        resultado: 'Colesterol LDL elevado',
        valores: 'LDL: 150 mg/dL'
      }
    ];
  }

  private getDiagnosticosSimulados(pacienteId: number): any[] {
    return [
      { 
        idDiagnostico: 1, 
        diagnostico: 'Hipertensión arterial leve',
        fecha: '2024-01-15',
        estado: 'Controlado'
      }
    ];
  }

  private getProcedimientosSimulados(pacienteId: number): any[] {
    return [
      { 
        idProcedimiento: 1, 
        nombreProcedimiento: 'Consulta general',
        fecha: '2024-01-15',
        resultado: 'Paciente estable'
      }
    ];
  }
}