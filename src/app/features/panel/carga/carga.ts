import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MockDataService} from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-carga',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './carga.html',
  styleUrl: './carga.scss',
})
export class CargaComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private mockData = inject(MockDataService);

  calculoForm: FormGroup = this.fb.group({
    kilos: ['', [Validators.required, Validators.min(1), Validators.max(1000000)]],
    tiempoObjetivo: ['', [Validators.required, Validators.min(1), Validators.max(24)]]
  });

  resultado: any = null;
  calculado: boolean = false;

  calcularRequerimiento() {
    if (this.calculoForm.valid) {
      const kilos = this.calculoForm.value.kilos;
      const tiempoObjetivo = this.calculoForm.value.tiempoObjetivo;
      
      const tiempoEfectivo = tiempoObjetivo - 1;
      if (tiempoEfectivo <= 0) {
        alert('El tiempo objetivo debe ser mayor a 1 hora.');
        return;
      }

      const etapas = this.mockData.etapasProceso;
      const necesarios: any = {};
      etapas.forEach(etapa => {
        necesarios[etapa.rol] = Math.ceil(kilos / (etapa.rendimiento * tiempoEfectivo));
      });

      const disponibles = this.mockData.trabajadoresDisponibles;

      this.resultado = { necesarios, disponibles };
      this.calculado = true;
    } else {
      this.calculoForm.markAllAsTouched();
    }
  }

  generarAsignacion() {
    if (this.calculoForm.valid) {
      this.router.navigate(['/panel/asignacion'], {
        queryParams: {
          kilos: this.calculoForm.value.kilos,
          tiempo: this.calculoForm.value.tiempoObjetivo
        }
      });
    }
  }
}
