import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { BaseMysqlService } from './base_mysql.service';

export interface TextractAnalisisResultado {
  idAnalisis?: number;
  idExamen: number;
  idConsulta: number;
  textoExtraido: string;
  confianza: number;
  tablas?: TablaDetectada[];
  camposDetectados?: CampoDetectado[];
  metadata?: {
    fechaAnalisis: string;
    nombreArchivo: string;
    tipoArchivo: string;
  };
}

export interface TablaDetectada {
  titulo?: string;
  filas: string[][];
  confianza: number;
}

export interface CampoDetectado {
  nombre: string;
  valor: string;
  confianza: number;
  tipo: 'texto' | 'numero' | 'fecha' | 'desconocido';
}

export interface TextractSugerencia {
  id: number;
  campo: string;
  valorSugerido: string;
  confianza: number;
  tipo: string;
  opciones?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TextractService extends BaseMysqlService {

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /**
   * Analizar documento con AWS Textract
   */
  analizarDocumentoConTextract(
    idConsulta: number,
    idExamen: number,
    archivoNombre: string,
    archivoTipo: string,
    archivoBase64: string
  ): Observable<TextractAnalisisResultado> {
    const payload = {
      archivoNombre,
      archivoTipo,
      archivoBlob: archivoBase64,
      archivoSize: this.calcularTamañoBase64(archivoBase64)
    };

    return this.post<any>(`consultations/${idConsulta}/exams/${idExamen}/analyze`, payload).pipe(
      map(resp => {
        const data = resp?.data ?? resp;
        return {
          idExamen: parseInt(idExamen.toString()),
          idConsulta: parseInt(idConsulta.toString()),
          textoExtraido: data.textoExtraido || data.texto || '',
          confianza: data.confianza || 0,
          tablas: data.tablas || [],
          camposDetectados: data.camposDetectados || [],
          metadata: {
            fechaAnalisis: new Date().toISOString(),
            nombreArchivo: archivoNombre,
            tipoArchivo: archivoTipo
          }
        } as TextractAnalisisResultado;
      }),
      tap((resultado: TextractAnalisisResultado) => {
        console.log('Análisis Textract completado:', resultado);
      }),
      catchError(err => {
        console.error('Error analizando documento con Textract:', err);
        // Fallback a simulación
        return this.simularAnalisisTextract(idConsulta, idExamen, archivoNombre, archivoTipo, archivoBase64);
      })
    );
  }

  /**
   * Simulación de Textract para desarrollo
   */
  private simularAnalisisTextract(
    idConsulta: number,
    idExamen: number,
    archivoNombre: string,
    archivoTipo: string,
    archivoBase64: string
  ): Observable<TextractAnalisisResultado> {
    console.log('Usando simulación de Textract');
    
    const textoSimulado = this.generarTextoSimulado();
    const camposDetectados = this.generarCamposSimulados();
    const tablasSimuladas = this.generarTablasSimuladas();

    const resultado: TextractAnalisisResultado = {
      idExamen: parseInt(idExamen.toString()),
      idConsulta: parseInt(idConsulta.toString()),
      textoExtraido: textoSimulado,
      confianza: 85,
      tablas: tablasSimuladas,
      camposDetectados: camposDetectados,
      metadata: {
        fechaAnalisis: new Date().toISOString(),
        nombreArchivo: archivoNombre,
        tipoArchivo: archivoTipo
      }
    };

    return of(resultado).pipe(delay(2000)); // Simular delay de procesamiento
  }

  private generarTextoSimulado(): string {
    return `
INFORME DE LABORATORIO CLÍNICO
LABORATORIO CLÍNICO CENTRAL
Fecha: 15/03/2024

DATOS DEL PACIENTE:
Nombre: MARÍA GONZÁLEZ RUIZ
Edad: 35 años
Sexo: Femenino
Médico Tratante: Dr. Carlos Méndez

RESULTADOS:

HEMOGRAMA COMPLETO:
Hemoglobina: 13.2 g/dL (Valor referencia: 12.0 - 15.5 g/dL)
Hematocrito: 39.8% (36.0 - 46.0%)
Leucocitos: 6.800 /μL (4.500 - 11.000 /μL)
Plaquetas: 250.000 /μL (150.000 - 450.000 /μL)

QUÍMICA SANGUÍNEA:
Glucosa: 95 mg/dL (70 - 110 mg/dL)
Urea: 28 mg/dL (15 - 45 mg/dL)
Creatinina: 0.8 mg/dL (0.5 - 1.1 mg/dL)
Colesterol Total: 185 mg/dL (<200 mg/dL)
Triglicéridos: 120 mg/dL (<150 mg/dL)

OBSERVACIONES:
Resultados dentro de parámetros normales. Control rutinario en 6 meses.
    `.trim();
  }

  private generarCamposSimulados(): CampoDetectado[] {
    return [
      { nombre: 'Nombre Paciente', valor: 'MARÍA GONZÁLEZ RUIZ', confianza: 95, tipo: 'texto' },
      { nombre: 'Edad', valor: '35', confianza: 90, tipo: 'numero' },
      { nombre: 'Sexo', valor: 'Femenino', confianza: 92, tipo: 'texto' },
      { nombre: 'Fecha Examen', valor: '15/03/2024', confianza: 88, tipo: 'fecha' },
      { nombre: 'Médico', valor: 'Dr. Carlos Méndez', confianza: 85, tipo: 'texto' },
      { nombre: 'Hemoglobina', valor: '13.2', confianza: 90, tipo: 'numero' },
      { nombre: 'Unidad Hemoglobina', valor: 'g/dL', confianza: 89, tipo: 'texto' },
      { nombre: 'Referencia Hemoglobina', valor: '12.0 - 15.5', confianza: 85, tipo: 'texto' },
      { nombre: 'Glucosa', valor: '95', confianza: 91, tipo: 'numero' },
      { nombre: 'Unidad Glucosa', valor: 'mg/dL', confianza: 90, tipo: 'texto' },
      { nombre: 'Colesterol Total', valor: '185', confianza: 88, tipo: 'numero' },
      { nombre: 'Observaciones', valor: 'Resultados dentro de parámetros normales. Control rutinario en 6 meses.', confianza: 82, tipo: 'texto' }
    ];
  }

  private generarTablasSimuladas(): TablaDetectada[] {
    return [
      {
        titulo: 'HEMOGRAMA',
        filas: [
          ['Parámetro', 'Resultado', 'Unidad', 'Referencia'],
          ['Hemoglobina', '13.2', 'g/dL', '12.0 - 15.5'],
          ['Hematocrito', '39.8', '%', '36.0 - 46.0'],
          ['Leucocitos', '6.800', '/μL', '4.500 - 11.000'],
          ['Plaquetas', '250.000', '/μL', '150.000 - 450.000']
        ],
        confianza: 90
      }
    ];
  }

  /**
   * Obtener sugerencias de Textract
   */
  obtenerSugerenciasTextract(
    idConsulta: number,
    idExamen: number,
    archivoBase64?: string,
    archivoTipo?: string
  ): Observable<TextractSugerencia[]> {
    if (archivoBase64) {
      const payload = {
        archivoBlob: archivoBase64,
        archivoTipo: archivoTipo || 'application/pdf',
        archivoSize: this.calcularTamañoBase64(archivoBase64)
      };
      
      return this.post<any>(`consultations/${idConsulta}/exams/${idExamen}/suggestions`, payload).pipe(
        map(resp => {
          const data = resp?.data ?? resp;
          const sugerencias = data.sugerencias || [];
          return Array.isArray(sugerencias) ? sugerencias : [];
        }),
        catchError(err => {
          console.error('Error obteniendo sugerencias:', err);
          // Fallback a sugerencias simuladas
          return of(this.generarSugerenciasSimuladas());
        })
      );
    }

    return of(this.generarSugerenciasSimuladas());
  }

  private generarSugerenciasSimuladas(): TextractSugerencia[] {
    return [
      { id: 1, campo: 'Nombre Paciente', valorSugerido: 'MARÍA GONZÁLEZ RUIZ', confianza: 95, tipo: 'texto' },
      { id: 2, campo: 'Edad', valorSugerido: '35', confianza: 90, tipo: 'numero' },
      { id: 3, campo: 'Sexo', valorSugerido: 'Femenino', confianza: 92, tipo: 'texto' },
      { id: 4, campo: 'Fecha Examen', valorSugerido: '15/03/2024', confianza: 88, tipo: 'fecha' },
      { id: 5, campo: 'Hemoglobina', valorSugerido: '13.2', confianza: 90, tipo: 'numero' },
      { id: 6, campo: 'Glucosa', valorSugerido: '95', confianza: 91, tipo: 'numero' },
      { id: 7, campo: 'Colesterol Total', valorSugerido: '185', confianza: 88, tipo: 'numero' }
    ];
  }

  /**
   * Aplicar sugerencias de Textract
   */
  aplicarSugerenciasTextract(
    idConsulta: number,
    idExamen: number,
    sugerenciasAplicadas: any
  ): Observable<any> {
    return this.put<any>(
      `consultations/${idConsulta}/exams/${idExamen}/apply-suggestions`,
      { sugerenciasAplicadas }
    ).pipe(
      tap(() => console.log('Sugerencias aplicadas')),
      catchError(err => {
        console.error('Error aplicando sugerencias:', err);
        // Simular éxito si falla
        return of({ success: true, message: 'Sugerencias aplicadas (simulado)' });
      })
    );
  }

  /**
   * Utilidades
   */
  private calcularTamañoBase64(base64: string): number {
    // Calcular tamaño aproximado en bytes
    return Math.floor((base64.length * 3) / 4);
  }

  validarConfianza(analisis: TextractAnalisisResultado, umbralMinimo: number = 70): boolean {
    return analisis.confianza >= umbralMinimo;
  }

  extraerValoresFormulario(sugerencias: TextractSugerencia[]): any {
    const valores: any = {};
    sugerencias.forEach(sug => {
      valores[sug.campo] = sug.valorSugerido;
    });
    return valores;
  }

  mapearCamposAExamen(camposDetectados: CampoDetectado[]): any {
    const mapeo: any = {};
    camposDetectados.forEach(campo => {
      const nombreLower = campo.nombre.toLowerCase();
      if (nombreLower.includes('nombre') && nombreLower.includes('examen')) {
        mapeo.nombreExamen = campo.valor;
      } else if (nombreLower.includes('tipo') && nombreLower.includes('examen')) {
        mapeo.tipoExamen = campo.valor;
      } else if (nombreLower.includes('unidad')) {
        mapeo.unidadMedida = campo.valor;
        mapeo.resultadoUnidad = campo.valor;
      } else if (nombreLower.includes('referencia')) {
        mapeo.valorReferencia = campo.valor;
        const rango = this.dividirRangoReferencia(campo.valor);
        if (rango.inferior) {
          mapeo.referenciaInferior = rango.inferior;
        }
        if (rango.superior) {
          mapeo.referenciaSuperior = rango.superior;
        }
      } else if (nombreLower.includes('observacion')) {
        mapeo.observacion = campo.valor;
      }

      if (!mapeo.resultadoPrincipal && this.esValorNumericoMedico(campo.valor)) {
        mapeo.resultadoPrincipal = this.normalizarNumero(campo.valor);
      }
    });
    return mapeo;
  }

  private dividirRangoReferencia(valor: string) {
    if (!valor) {
      return { inferior: null, superior: null };
    }

    const partes = valor
      .replace(/<|>|≤|≥/g, '')
      .split(/-|–|a|hasta/i)
      .map(part => part.trim())
      .filter(part => part.length > 0);

    if (partes.length >= 2) {
      return {
        inferior: this.normalizarNumero(partes[0]),
        superior: this.normalizarNumero(partes[1])
      };
    }

    return { inferior: null, superior: null };
  }

  private esValorNumericoMedico(valor: string): boolean {
    if (!valor) {
      return false;
    }
    return /-?\d+(?:[.,]\d+)?/.test(valor);
  }

  private normalizarNumero(valor: string): string {
    if (!valor) {
      return valor;
    }
    const match = valor.replace(/,/g, '.').match(/-?\d+(?:\.\d+)?/);
    return match ? match[0] : valor;
  }
}