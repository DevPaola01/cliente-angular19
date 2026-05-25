import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClienteService } from './services/cliente.service';
import { Cliente, EstadoMetricas } from './models/cliente.model';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ClientGridComponent } from './components/client-grid/client-grid.component';
import { MetricsPanelComponent } from './components/metrics-panel/metrics-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SearchBarComponent,
    ClientGridComponent,
    MetricsPanelComponent,
  ],
  template: `
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <h1 style="margin-bottom: 10px; color: #333;">Búsqueda de Clientes</h1>
      <p style="color: #666; margin-bottom: 30px;">Sistema de benchmarking React 19 vs Angular 19</p>

      <app-search-bar [isLoading]="isLoading()" (buscar)="handleBuscar()"></app-search-bar>

      <app-client-grid
        [clientes]="clientes()"
        [isLoading]="isLoading()"
        [error]="error()"
      ></app-client-grid>

      <app-metrics-panel [metricas]="metricas()"></app-metrics-panel>
    </div>
  `,
})
export class AppComponent {
  private clienteService = inject(ClienteService);

  clientes = signal<Cliente[]>([]);
  metricas = signal<EstadoMetricas | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  async handleBuscar(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    this.clientes.set([]);
    this.metricas.set(null);

    try {
      const { clientes: clientesData, metricas: metricasData } =
        await this.clienteService.obtenerClientes();

      this.clientes.set(clientesData);
      this.metricas.set({
        scriptingTime: metricasData.scriptingTime,
        transformacionDatos: metricasData.transformacionDatos,
        renderingPainting: metricasData.renderingPainting,
        bundleSize: metricasData.bundleSize,
        cacheStatus: metricasData.cacheStatus,
        tiempoCache: metricasData.tiempoCache,
        tiempoNoCache: metricasData.tiempoNoCache,
      });
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error desconocido');
      this.clientes.set([]);
      this.metricas.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }
}
