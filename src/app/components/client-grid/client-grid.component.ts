import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-client-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" style="padding: 20px; text-align: center; font-size: 18px; color: #666;">
      Cargando datos...
    </div>

    <div
      *ngIf="error"
      style="padding: 20px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; color: #721c24;"
    >
      Error: {{ error }}
    </div>

    <div
      *ngIf="!isLoading && !error && (!clientes || clientes.length === 0)"
      style="padding: 20px; text-align: center; color: #999;"
    >
      Haga clic en "Obtener Clientes" para ver la lista
    </div>

    <div *ngIf="clientes && clientes.length > 0 && !isLoading && !error" style="margin-bottom: 20px; overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">
              Nombre
            </th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">
              Identificación
            </th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">
              Celular
            </th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">
              Dirección
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cliente of clientes; let even = even" [style]="{ backgroundColor: even ? '#fafafa' : 'white' }">
            <td style="padding: 12px; border: 1px solid #ddd;">{{ cliente.name }}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">{{ cliente.identificationNumber }}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">{{ cliente.phone }}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">{{ cliente.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class ClientGridComponent {
  @Input() clientes: Cliente[] | null = null;
  @Input() isLoading = false;
  @Input() error: string | null = null;
}
