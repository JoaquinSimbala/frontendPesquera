import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service';

export interface Costo {
  id: number;
  categoria: string;
  concepto: string;
  monto: number;
  fechaCosto: string;
  descripcion: string;
  fechaRegistro: string;
}

export interface ResumenCostos {
  totalMes: number;
  totalGeneral: number;
  porCategoria: { [categoria: string]: number };
}

export interface DatosCostos {
  costos: Costo[];
  resumen: ResumenCostos;
  categorias: string[];
}

export interface NuevoCosto {
  categoria: string;
  concepto: string;
  monto: number;
  fechaCosto: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class CostosService {
  private mockData = inject(MockDataService);

  obtenerDatos(): Observable<DatosCostos> {
    const costos = this.mockData.getCostos();
    const total = costos.reduce((acc: number, c: any) => acc + c.monto, 0);
    return of({
      costos: [...costos].reverse(),
      resumen: {
        totalMes: total,
        totalGeneral: total,
        porCategoria: { 'Operativo': total }
      },
      categorias: ['Operativo', 'Mantenimiento', 'Administrativo']
    });
  }

  registrar(costo: NuevoCosto): Observable<any> {
    this.mockData.saveCosto({...costo, fechaRegistro: new Date().toISOString()});
    return of({ success: true });
  }
}
