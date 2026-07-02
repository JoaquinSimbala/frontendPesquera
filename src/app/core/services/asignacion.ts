import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service';

export interface TrabajadorAsignado {
  id: number;
  nombreCompleto: string;
  dni: string;
  rendimiento: number;
}

export interface AsignacionResponse {
  deficitPersonal: boolean;
  horasRecomendadas: number;
  asignaciones: { [key: string]: TrabajadorAsignado[] };
  necesarios: { [key: string]: number };
  disponibles: { [key: string]: number };
}

export interface CalculoCargaRequest {
  kilos: number;
  tiempoObjetivo: number;
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private mockData = inject(MockDataService);

  generarAsignacion(calculo: CalculoCargaRequest): Observable<AsignacionResponse> {
    const { kilos, tiempoObjetivo } = calculo;
    const tiempoEfectivo = tiempoObjetivo - 1;

    const necesarios: { [key: string]: number } = {};
    this.mockData.etapasProceso.forEach(etapa => {
      necesarios[etapa.rol] = Math.ceil(kilos / (etapa.rendimiento * tiempoEfectivo));
    });

    const asignaciones: { [key: string]: TrabajadorAsignado[] } = {};
    let hayDeficit = false;

    for (const rol of Object.keys(necesarios)) {
      const cantNecesaria = necesarios[rol];
      const pool = (this.mockData.trabajadoresPorRolMock as any)[rol] ?? [];

      if (pool.length < cantNecesaria) {
        hayDeficit = true;
        asignaciones[rol] = [...pool];
      } else {
        asignaciones[rol] = pool.slice(0, cantNecesaria);
      }
    }

    const disponibles: { [key: string]: number } = {};
    for (const rol of Object.keys(necesarios)) {
      disponibles[rol] = ((this.mockData.trabajadoresPorRolMock as any)[rol] ?? []).length;
    }

    const respuesta: AsignacionResponse = {
      deficitPersonal: hayDeficit,
      horasRecomendadas: tiempoObjetivo,
      asignaciones,
      necesarios,
      disponibles
    };

    this.mockData.saveAsignacion(respuesta);
    return of(respuesta);
  }
}
