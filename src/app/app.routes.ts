import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { CargaComponent } from './features/panel/carga/carga';
import { InventarioComponent } from './features/panel/inventario/inventario';
import { Asignacion } from './features/panel/asignacion/asignacion';
import { Calidad } from './features/panel/calidad/calidad';
import { Costos } from './features/panel/costos/costos';
import { Liquidaciones } from './features/panel/liquidaciones/liquidaciones';
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'panel',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'carga', pathMatch: 'full' },
      { path: 'asignacion', component: Asignacion },
      { path: 'carga', component: CargaComponent},
      { path: 'calidad', component: Calidad },
      { path: 'costos', component: Costos },
      { path: 'liquidaciones', component: Liquidaciones },
      { path: 'inventario', component: InventarioComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
