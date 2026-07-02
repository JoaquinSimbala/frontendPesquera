import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private readonly STORAGE_KEY = 'pesquera_mock_data';

  public readonly mockUsers = [
    { username: 'gerente', password: '123456', rol: 'GERENTE' },
    { username: 'supervisor', password: '123456', rol: 'SUPERVISOR' }
  ];

  public readonly etapasProceso = [
    { rol: 'Apoyos', rendimiento: 500.0 },
    { rol: 'Limpieza', rendimiento: 60.0 },
    { rol: 'Clasificado', rendimiento: 250.0 },
    { rol: 'Envasado', rendimiento: 150.0 }
  ];

  public readonly trabajadoresDisponibles = {
    'Apoyos': 10,
    'Limpieza': 50,
    'Clasificado': 20,
    'Envasado': 15
  };

  public readonly trabajadoresPorRolMock = this.generarTrabajadoresMock();

  private generarTrabajadoresMock() {
    const nombres = ['Juan', 'Maria', 'Carlos', 'Ana', 'Luis', 'Pedro', 'Andres', 'Roberto', 'Carmen', 'Rosa', 'Teresa', 'Lucia', 'Fernando', 'Jorge', 'Alberto', 'Daniel', 'Elena', 'Sofia', 'Patricia', 'Marta', 'Gabriel', 'Raul', 'Victor', 'Hugo', 'Diego', 'Camila', 'Valeria', 'Javier', 'Miguel'];
    const apellidos = ['Perez', 'Gomez', 'Ruiz', 'Soto', 'Vega', 'Sanchez', 'Castro', 'Silva', 'Rojas', 'Torres', 'Vargas', 'Muñoz', 'Rios', 'Diaz', 'Medina', 'Flores', 'Paz', 'Luna', 'Gil', 'Rivas', 'Ortiz', 'Morales', 'Herrera', 'Mendoza'];

    let idCounter = 1;
    const generar = (cantidad: number, rendimiento: number) => {
      return Array.from({ length: cantidad }).map(() => {
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        const fullName = `${nombre} ${apellido}`;
        return {
          id: idCounter++,
          nombreCompleto: fullName,
          nombre: fullName,
          dni: Math.floor(10000000 + Math.random() * 90000000).toString(),
          rendimiento: rendimiento
        };
      });
    };

    return {
      'Apoyos': generar(this.trabajadoresDisponibles['Apoyos'], 500),
      'Limpieza': generar(this.trabajadoresDisponibles['Limpieza'], 60),
      'Clasificado': generar(this.trabajadoresDisponibles['Clasificado'], 250),
      'Envasado': generar(this.trabajadoresDisponibles['Envasado'], 150)
    };
  }

  public readonly tarifasMock = {
    'Apoyos': 1.5,
    'Limpieza': 1.2,
    'Clasificado': 1.8,
    'Envasado': 2.0
  };

  private data: any = {
    inventario: {
      historial: [
        { fecha: '2026-06-25T10:00:00Z', tipo: 'INGRESO', loteReferencia: 'LOTE-101', kilos: 5000, destino: 'ALMACEN PRINCIPAL' },
        { fecha: '2026-06-26T11:30:00Z', tipo: 'INGRESO', loteReferencia: 'LOTE-102', kilos: 3000, destino: 'ALMACEN PRINCIPAL' },
        { fecha: '2026-06-27T09:15:00Z', tipo: 'DISTRIBUCION', loteReferencia: 'LOTE-101', kilos: 2000, destino: 'Planta A' },
        { fecha: '2026-06-28T14:20:00Z', tipo: 'INGRESO', loteReferencia: 'LOTE-103', kilos: 4000, destino: 'ALMACEN PRINCIPAL' },
        { fecha: '2026-06-29T16:45:00Z', tipo: 'DISTRIBUCION', loteReferencia: 'LOTE-102', kilos: 1000, destino: 'Exportación' }
      ],
      metricas: { totalIngresado: 12000, totalDistribuido: 3000, lotesActivos: 3 },
      destinosDisponibles: ['Planta A', 'Planta B', 'Exportación'],
      lotesDisponibles: { 'LOTE-101': 3000, 'LOTE-102': 2000, 'LOTE-103': 4000 }
    },
    asignaciones: [
      { id: 1001, deficitPersonal: false, horasRecomendadas: 8, asignaciones: { 'Apoyos': [{ id: 1, nombreCompleto: 'Juan Perez', dni: '12345678', rendimiento: 500 }] } },
      { id: 1002, deficitPersonal: true, horasRecomendadas: 10, asignaciones: { 'Limpieza': [{ id: 2, nombreCompleto: 'Maria Gomez', dni: '87654321', rendimiento: 60 }] } },
      { id: 1003, deficitPersonal: false, horasRecomendadas: 5, asignaciones: { 'Clasificado': [{ id: 3, nombreCompleto: 'Carlos Ruiz', dni: '11223344', rendimiento: 250 }] } },
      { id: 1004, deficitPersonal: false, horasRecomendadas: 6, asignaciones: { 'Envasado': [{ id: 4, nombreCompleto: 'Ana Soto', dni: '44332211', rendimiento: 150 }] } },
      { id: 1005, deficitPersonal: false, horasRecomendadas: 4, asignaciones: { 'Apoyos': [{ id: 5, nombreCompleto: 'Luis Vega', dni: '11111111', rendimiento: 500 }] } }
    ],
    calidad: [
      { id: 2001, loteReferencia: 'LOTE-101', temperatura: -18.5, ph: 6.8, higienePersonal: true, limpiezaEquipos: true, estadoHaccp: 'APROBADO', observaciones: 'Óptimas condiciones', fechaRegistro: '2026-06-25T10:30:00Z' },
      { id: 2002, loteReferencia: 'LOTE-102', temperatura: -15.0, ph: 7.1, higienePersonal: true, limpiezaEquipos: false, estadoHaccp: 'OBSERVADO', observaciones: 'Revisar faja transportadora', fechaRegistro: '2026-06-26T12:00:00Z' },
      { id: 2003, loteReferencia: 'LOTE-101', temperatura: -12.0, ph: 7.5, higienePersonal: false, limpiezaEquipos: false, estadoHaccp: 'RECHAZADO', observaciones: 'Cadena de frío rota', fechaRegistro: '2026-06-27T09:45:00Z' },
      { id: 2004, loteReferencia: 'LOTE-103', temperatura: -19.0, ph: 6.9, higienePersonal: true, limpiezaEquipos: true, estadoHaccp: 'APROBADO', observaciones: 'Sin observaciones', fechaRegistro: '2026-06-28T15:00:00Z' },
      { id: 2005, loteReferencia: 'LOTE-102', temperatura: -18.0, ph: 7.0, higienePersonal: true, limpiezaEquipos: true, estadoHaccp: 'APROBADO', observaciones: 'Subsanado', fechaRegistro: '2026-06-29T17:00:00Z' }
    ],
    costos: [
      { id: 3001, categoria: 'Operativo', concepto: 'Energía Eléctrica Planta A', monto: 1500.50, fechaCosto: '2026-06-20', descripcion: 'Recibo mensual de luz', fechaRegistro: '2026-06-21T08:00:00Z' },
      { id: 3002, categoria: 'Mantenimiento', concepto: 'Reparación Motor Frío', monto: 850.00, fechaCosto: '2026-06-22', descripcion: 'Repuestos y mano de obra', fechaRegistro: '2026-06-23T09:30:00Z' },
      { id: 3003, categoria: 'Administrativo', concepto: 'Útiles de Oficina', monto: 120.00, fechaCosto: '2026-06-24', descripcion: 'Papelería y tintas', fechaRegistro: '2026-06-24T14:15:00Z' },
      { id: 3004, categoria: 'Operativo', concepto: 'Agua Potable', monto: 450.75, fechaCosto: '2026-06-25', descripcion: 'Recibo mensual de agua', fechaRegistro: '2026-06-26T11:00:00Z' },
      { id: 3005, categoria: 'Mantenimiento', concepto: 'Mantenimiento Preventivo', monto: 1200.00, fechaCosto: '2026-06-28', descripcion: 'Contrato mensual empresa externa', fechaRegistro: '2026-06-29T10:00:00Z' }
    ],
    liquidaciones: [
      { id: 4001, trabajadorNombre: 'Juan Perez', trabajadorRol: 'Apoyos', kilosProcesados: 1000, tarifaPorKilo: 1.5, montoTotal: 1500.00, fechaProduccion: '2026-06-25', aprobado: true, fechaRegistro: '2026-06-26T08:00:00Z' },
      { id: 4002, trabajadorNombre: 'Maria Gomez', trabajadorRol: 'Limpieza', kilosProcesados: 500, tarifaPorKilo: 1.2, montoTotal: 600.00, fechaProduccion: '2026-06-25', aprobado: true, fechaRegistro: '2026-06-26T08:05:00Z' },
      { id: 4003, trabajadorNombre: 'Carlos Ruiz', trabajadorRol: 'Clasificado', kilosProcesados: 800, tarifaPorKilo: 1.8, montoTotal: 1440.00, fechaProduccion: '2026-06-26', aprobado: false, fechaRegistro: '2026-06-27T09:00:00Z' },
      { id: 4004, trabajadorNombre: 'Ana Soto', trabajadorRol: 'Envasado', kilosProcesados: 600, tarifaPorKilo: 2.0, montoTotal: 1200.00, fechaProduccion: '2026-06-27', aprobado: false, fechaRegistro: '2026-06-28T10:30:00Z' },
      { id: 4005, trabajadorNombre: 'Luis Vega', trabajadorRol: 'Apoyos', kilosProcesados: 1200, tarifaPorKilo: 1.5, montoTotal: 1800.00, fechaProduccion: '2026-06-28', aprobado: true, fechaRegistro: '2026-06-29T11:15:00Z' }
    ]
  };

  constructor() {
    this.loadData();
  }

  private loadData() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.data = JSON.parse(stored);
    } else {
      this.saveData();
    }
  }

  private saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  getInventarioDashboard() {
    return this.data.inventario;
  }

  ingresoLote(lote: any) {
    this.data.inventario.historial.push({
      fecha: new Date().toISOString(),
      tipo: 'INGRESO',
      loteReferencia: lote.codigoLote,
      kilos: lote.kilosIniciales,
      destino: 'ALMACEN PRINCIPAL'
    });
    this.data.inventario.metricas.totalIngresado += lote.kilosIniciales;

    if (!this.data.inventario.lotesDisponibles[lote.codigoLote]) {
      this.data.inventario.lotesDisponibles[lote.codigoLote] = 0;
      this.data.inventario.metricas.lotesActivos++;
    }
    this.data.inventario.lotesDisponibles[lote.codigoLote] += lote.kilosIniciales;

    this.saveData();
  }

  registrarDistribucion(dist: any) {
    const loteId = dist.loteReferencia;
    const kilos = dist.kilosTotales;

    if (this.data.inventario.lotesDisponibles[loteId] && this.data.inventario.lotesDisponibles[loteId] >= kilos) {
      this.data.inventario.lotesDisponibles[loteId] -= kilos;
      this.data.inventario.metricas.totalDistribuido += kilos;

      if (this.data.inventario.lotesDisponibles[loteId] === 0) {
        delete this.data.inventario.lotesDisponibles[loteId];
        this.data.inventario.metricas.lotesActivos--;
      }

      this.data.inventario.historial.push({
        fecha: new Date().toISOString(),
        tipo: 'DISTRIBUCION',
        loteReferencia: loteId,
        kilos: kilos,
        destino: dist.destino
      });

      this.saveData();
      return true;
    }
    return false;
  }

  getAsignaciones() {
    return this.data.asignaciones;
  }
  saveAsignacion(asig: any) {
    this.data.asignaciones.push({ ...asig, id: Date.now() });
    this.saveData();
  }

  getCalidad() {
    return this.data.calidad;
  }
  saveCalidad(cal: any) {
    this.data.calidad.push({ ...cal, id: Date.now() });
    this.saveData();
  }

  getCostos() {
    return this.data.costos;
  }
  saveCosto(costo: any) {
    this.data.costos.push({ ...costo, id: Date.now() });
    this.saveData();
  }

  getLiquidaciones() {
    return this.data.liquidaciones;
  }
  saveLiquidacion(liq: any) {
    this.data.liquidaciones.push({ ...liq, id: Date.now() });
    this.saveData();
  }
}
