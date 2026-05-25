import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="margin-bottom: 20px;">
      <button
        (click)="handleClick()"
        [disabled]="isLoading"
        [style]="getButtonStyle()"
      >
        {{ isLoading ? 'Cargando...' : 'Obtener Clientes' }}
      </button>
    </div>
  `,
})
export class SearchBarComponent {
  @Input() isLoading = false;
  @Output() buscar = new EventEmitter<void>();

  handleClick(): void {
    this.buscar.emit();
  }

  getButtonStyle(): string {
    return `
      padding: 10px 20px;
      font-size: 16px;
      background-color: ${this.isLoading ? '#ccc' : '#007bff'};
      color: white;
      border: none;
      border-radius: 4px;
      cursor: ${this.isLoading ? 'not-allowed' : 'pointer'};
    `;
  }
}
