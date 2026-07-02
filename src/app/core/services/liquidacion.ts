import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockDataService } from './mock-data.service';

export interface Liquidacion {
  id: number;
  trabajadorNombre: string;
  trabajadorRol: string;
  kilosProcesados: number;
  tarifaPorKilo: number;
  montoTotal: number;
  fechaProduccion: string;
  aprobado: boolean;
  fechaRegistro: string;
}

export interface ResumenLiquidacion {
  totalRegistros: number;
  pendientesAprobacion: number;
  montoTotal: number;
  montoAprobado: number;
  montoPendiente: number;
}

export interface Trabajador {
  id: number;
  nombre: string;
  dni: string;
}

export interface DatosLiquidacion {
  liquidaciones: Liquidacion[];
  resumen: ResumenLiquidacion;
  trabajadoresPorRol: { [rol: string]: Trabajador[] };
  tarifas: { [rol: string]: number };
}

@Injectable({ providedIn: 'root' })
export class LiquidacionService {
  private mockData = inject(MockDataService);

  obtenerDatos(): Observable<DatosLiquidacion> {
    const liq = this.mockData.getLiquidaciones();
    return of({
      liquidaciones: [...liq].reverse(),
      resumen: {
        totalRegistros: liq.length,
        pendientesAprobacion: liq.filter((l: any) => !l.aprobado).length,
        montoTotal: liq.reduce((acc: number, l: any) => acc + l.montoTotal, 0),
        montoAprobado: liq.filter((l: any) => l.aprobado).reduce((acc: number, l: any) => acc + l.montoTotal, 0),
        montoPendiente: liq.filter((l: any) => !l.aprobado).reduce((acc: number, l: any) => acc + l.montoTotal, 0)
      },
      trabajadoresPorRol: this.mockData.trabajadoresPorRolMock,
      tarifas: this.mockData.tarifasMock
    });
  }

  registrar(trabajadorId: number, kilosProcesados: number): Observable<any> {
    let trabajadorNombre = 'Desconocido';
    let trabajadorRol = 'Desconocido';

    for (const [rol, lista] of Object.entries(this.mockData.trabajadoresPorRolMock)) {
      const encontrado = (lista as any[]).find((t: any) => t.id === trabajadorId);
      if (encontrado) {
        trabajadorNombre = encontrado.nombreCompleto;
        trabajadorRol = rol;
        break;
      }
    }

    const tarifas: any = this.mockData.tarifasMock;
    const tarifaPorKilo: number = tarifas[trabajadorRol] ?? 0;
    const montoTotal = kilosProcesados * tarifaPorKilo;

    this.mockData.saveLiquidacion({
      trabajadorNombre,
      trabajadorRol,
      kilosProcesados,
      tarifaPorKilo,
      montoTotal,
      fechaProduccion: new Date().toISOString().split('T')[0],
      aprobado: false,
      fechaRegistro: new Date().toISOString()
    });
    return of({ success: true });
  }

  aprobar(id: number): Observable<any> {
    const liq = this.mockData.getLiquidaciones().find((l: any) => l.id === id);
    if (liq) liq.aprobado = true;
    localStorage.setItem('pesquera_mock_data', JSON.stringify(this.mockData['data']));
    return of({ success: true });
  }

  registrarLote(trabajadores: { trabajadorId: number; kilosProcesados: number }[]): Observable<any> {
    trabajadores.forEach(t => this.registrar(t.trabajadorId, t.kilosProcesados));
    return of({ success: true });
  }
}
