import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockDataService } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss'
})
export class InventarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private mockData = inject(MockDataService);

  ingresoForm: FormGroup = this.fb.group({
    codigoLote: ['', Validators.required],
    kilosIniciales: ['', [Validators.required, Validators.min(1)]]
  });

  inventarioForm: FormGroup = this.fb.group({
    loteReferencia: ['', Validators.required],
    kilosTotales: ['', [Validators.required, Validators.min(0.1)]],
    destino: ['', Validators.required]
  });

  historial = signal<any[]>([]);
  metricas = signal<any>(null);
  destinosDisponibles = signal<string[]>([]);
  lotesDisponibles = signal<{ [key: string]: number }>({});

  mensajeExito = signal<string>('');
  mensajeError = signal<string>('');

  ngOnInit() {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    const data = this.mockData.getInventarioDashboard();
    this.historial.set([...data.historial].reverse());
    this.metricas.set({ ...data.metricas });
    this.destinosDisponibles.set([...data.destinosDisponibles]);
    this.lotesDisponibles.set({ ...data.lotesDisponibles });
  }

  registrarIngresoLote() {
    if (this.ingresoForm.valid) {
      this.mensajeError.set('');
      this.mockData.ingresoLote(this.ingresoForm.value);
      this.mensajeExito.set('Lote ingresado a almacen correctamente.');
      this.ingresoForm.reset();
      this.cargarDatosDashboard();
      setTimeout(() => this.mensajeExito.set(''), 3000);
    } else {
      this.ingresoForm.markAllAsTouched();
    }
  }

  registrarDistribucion() {
    if (this.inventarioForm.valid) {
      this.mensajeError.set('');
      const success = this.mockData.registrarDistribucion(this.inventarioForm.value);

      if (success) {
        this.mensajeExito.set('Distribucion registrada exitosamente.');
        this.inventarioForm.reset({ loteReferencia: '', destino: '' });
        this.cargarDatosDashboard();
        setTimeout(() => this.mensajeExito.set(''), 3000);
      } else {
        this.mensajeError.set('Error: No hay suficientes kilos en el lote seleccionado o el lote no existe.');
      }
    } else {
      this.inventarioForm.markAllAsTouched();
    }
  }
}
