import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { MockDataService } from './mock-data.service';

export interface AuthResponse {
  type: string;
  username: string;
  rol: string;
  expiration: Date;
}

export interface UserState {
  username: string;
  role: string;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockData = inject(MockDataService);

  private userState = signal<UserState>({
    username: '',
    role: '',
    isAuthenticated: false
  });

  public currentUser = computed(() => this.userState());

  constructor() {
    const storedState = localStorage.getItem('userState');
    if (storedState) {
      this.userState.set(JSON.parse(storedState));
    }
  }

  login(credentials: any): Observable<AuthResponse> {
    const user = this.mockData.mockUsers.find((u: any) => u.username === credentials.username && u.password === credentials.password);
    
    if (user) {
      const newState = {
        username: user.username,
        role: user.rol,
        isAuthenticated: true
      };
      this.userState.set(newState);
      localStorage.setItem('userState', JSON.stringify(newState));
      
      const response: AuthResponse = {
        type: 'Bearer',
        username: user.username,
        rol: user.rol,
        expiration: new Date(new Date().getTime() + 86400000)
      };
      
      return of(response).pipe(delay(500));
    } else {
      return throwError(() => ({ error: { message: 'Usuario o contraseña incorrectos. Usa gerente/123456 o supervisor/123456.' } })).pipe(delay(500));
    }
  }

  logout(): Observable<any> {
    this.userState.set({ username: '', role: '', isAuthenticated: false });
    localStorage.removeItem('userState');
    return of(null).pipe(delay(300));
  }

  getRole(): string {
    return this.userState().role;
  }
}
