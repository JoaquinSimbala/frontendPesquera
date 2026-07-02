import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service';

export interface ControlCalidad {
  id?: number;
  loteReferencia: string;
  temperatura: number;
  ph: number;
  higienePersonal: boolean;
  limpiezaEquipos: boolean;
  estadoHaccp: string;
  observaciones?: string;
  fechaRegistro?: string;
}

export interface CalidadMetricas {
  total: number;
  aprobados: number;
  rechazados: number;
  observados: number;
  alertasCriticas: number;
  aprobadosPct: number;
}

@Injectable({
  providedIn: 'root'
})
export class CalidadService {
  private mockData = inject(MockDataService);

  getMetricas(): Observable<CalidadMetricas> {
    const historial = this.mockData.getCalidad();
    const aprobados = historial.filter((h: any) => h.estadoHaccp === 'APROBADO').length;
    return of({
      total: historial.length,
      aprobados: aprobados,
      rechazados: historial.filter((h: any) => h.estadoHaccp === 'RECHAZADO').length,
      observados: historial.filter((h: any) => h.estadoHaccp === 'OBSERVADO').length,
      alertasCriticas: 0,
      aprobadosPct: historial.length ? (aprobados / historial.length) * 100 : 0
    });
  }

  getHistorial(): Observable<ControlCalidad[]> {
    return of([...this.mockData.getCalidad()].reverse());
  }

  registrarControl(form: ControlCalidad): Observable<any> {
    this.mockData.saveCalidad({ ...form, fechaRegistro: new Date().toISOString() });
    return of({ success: true });
  }
}
