import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

  // Datos simulados TEMPORALES - luego se conectarán a MySQL
  private pacientesSimulados: Paciente[] = [
    {
      idPaciente: 1,
      nombrePaciente: 'Miguel Torres',
      fechaNacimiento: '1989-05-15',
      correo: 'miguel@email.com',
      telefono: '+56912345678',
      direccion: 'Av. Principal 123',
      sexo: 'masculino',
      nacionalidad: 'Chilena',
      ocupacion: 'Ingeniero',
      prevision: 'FONASA',
      fotoPerfil: 'https://wallpapers.com/images/hd/cute-cats-pictures-hjlsa0ha0260veg4.jpg', 
      tipoSangre: 'AB-',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      idPaciente: 2,
      nombrePaciente: 'Ana García',
      fechaNacimiento: '1992-08-20',
      correo: 'ana.garcia@email.com',
      telefono: '+56987654321',
      direccion: 'Calle Secundaria 456',
      sexo: 'femenino',
      nacionalidad: 'Chilena',
      ocupacion: 'Doctora',
      prevision: 'ISAPRE',
      fotoPerfil: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKhffnAV6-AVnyZgD8LfZQZYE3BFCJGc1uIQ&s',
      tipoSangre: 'O+',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  constructor(http: HttpClient) {
    super(http);
  }

  // Obtener todos los pacientes
  getPacientes(): Observable<Paciente[]> {
    //datos simulados
    //console.log('Obteniendo pacientes desde servicio');
    //return of(this.pacientesSimulados);
    
    //conexión a MySQL
    return this.get<Paciente[]>('pacientes');

  }

  // Obtener paciente por ID con toda su ficha
  getPacienteById(id: number): Observable<FichaMedicaCompleta> {
    console.log(`Obteniendo ficha completa para paciente ID: ${id}`);
    
    const paciente = this.pacientesSimulados.find(p => p.idPaciente === id);
    
    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

    // Simulamos datos de todas las tablas relacionadas
    const fichaCompleta: FichaMedicaCompleta = {
      paciente: paciente,
      alergias: this.getAlergiasSimuladas(id),
      habitos: this.getHabitosSimulados(id),
      medicamentos: this.getMedicamentosSimulados(id),
      consultas: this.getConsultasSimuladas(id),
      examenes: this.getExamenesSimulados(id),
      diagnosticos: this.getDiagnosticosSimulados(id),
      procedimientos: this.getProcedimientosSimulados(id)
    };

    return of(fichaCompleta);
  }

  private getAlergiasSimuladas(pacienteId: number): any[] {
    const alergiasBase = [
      { idAlergia: 1, alergia: 'Penicilina', observacion: 'Reacción severa' },
      { idAlergia: 2, alergia: 'Mariscos', observacion: 'Urticaria' },
      { idAlergia: 3, alergia: 'Polvo', observacion: 'Estornudos' }
    ];
    return alergiasBase.slice(0, pacienteId + 1);
  }

  private getHabitosSimulados(pacienteId: number): any[] {
    return [
      { idHabito: 1, habito: 'Ejercicio', observacion: '3 veces por semana' },
      { idHabito: 2, habito: 'Alimentación', observacion: 'Dieta balanceada' }
    ];
  }

  private getMedicamentosSimulados(pacienteId: number): any[] {
    return [
      { idMedicamento: 1, nombreMedicamento: 'Enalapril 10mg', frecuencia: '1 vez al día' }
    ];
  }

  private getConsultasSimuladas(pacienteId: number): any[] {
    return [
      { 
        idConsulta: 1, 
        motivo: 'Control de rutina anual', 
        fechaIngreso: '2024-01-15',
        profesional: 'Dr. Carlos López'
      }
    ];
  }

  private getExamenesSimulados(pacienteId: number): any[] {
    return [
      { 
        idExamen: 1, 
        nombreExamen: 'Hemograma completo', 
        fecha: '2024-01-10',
        resultado: 'Dentro de rangos normales'
      }
    ];
  }

  private getDiagnosticosSimulados(pacienteId: number): any[] {
    return [
      { 
        idDiagnostico: 1, 
        diagnostico: 'Hipertensión arterial leve',
        fecha: '2024-01-15'
      }
    ];
  }

  private getProcedimientosSimulados(pacienteId: number): any[] {
    return [
      { 
        idProcedimiento: 1, 
        nombreProcedimiento: 'Consulta general',
        fecha: '2024-01-15'
      }
    ];
  }

  // Crear nuevo paciente
  /*crearPaciente(paciente: Omit<Paciente, 'idPaciente'>): Observable<Paciente> {
    const nuevoPaciente: Paciente = {
      ...paciente,
      idPaciente: this.pacientesSimulados.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.pacientesSimulados.push(nuevoPaciente);
    console.log('Paciente creado:', nuevoPaciente);
    return of(nuevoPaciente);
  }*/

  crearPaciente(paciente: Omit<Paciente, 'idPaciente'>): Observable<Paciente> {
    console.log('Enviando paciente a MySQL API:', paciente);
    return this.post<Paciente>('pacientes', paciente);
  }

  // Actualizar paciente
  actualizarPaciente(id: number, cambios: Partial<Paciente>): Observable<Paciente> {
    const index = this.pacientesSimulados.findIndex(p => p.idPaciente === id);
    
    if (index === -1) {
      throw new Error('Paciente no encontrado');
    }

    this.pacientesSimulados[index] = {
      ...this.pacientesSimulados[index],
      ...cambios,
      updated_at: new Date().toISOString()
    };

    console.log('Paciente actualizado:', this.pacientesSimulados[index]);
    return of(this.pacientesSimulados[index]);
  }

  // Eliminar paciente
  eliminarPaciente(id: number): Observable<void> {
    const index = this.pacientesSimulados.findIndex(p => p.idPaciente === id);
    
    if (index === -1) {
      throw new Error('Paciente no encontrado');
    }

    this.pacientesSimulados.splice(index, 1);
    console.log(`Paciente ID: ${id} eliminado`);
    return of(void 0);
  }
}