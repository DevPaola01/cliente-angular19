import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoMetricas } from '../../models/cliente.model';

@Component({
  selector: 'app-metrics-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="!metricas" style="padding: 20px; background-color: #f0f0f0; border-radius: 4px; text-align: center; color: #999;">
      Las métricas aparecerán después de realizar una búsqueda
    </div>

    <div *ngIf="metricas" style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px;">
      <h3 style="margin-top: 0; margin-bottom: 20px; color: #333;">Métricas de Rendimiento</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        
        <div style="padding: 15px; background-color: white; border: 1px solid #eee; border-radius: 4px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Scripting Time</div>
          <div style="font-size: 24px; font-weight: bold; color: #007bff;">
            {{ formatMetrica(metricas.scriptingTime) }}<span style="font-size: 14px; color: #999;"> ms</span>
          </div>
        </div>

        <div style="padding: 15px; background-color: white; border: 1px solid #eee; border-radius: 4px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Transformación de Datos</div>
          <div style="font-size: 24px; font-weight: bold; color: #28a745;">
            {{ formatMetrica(metricas.transformacionDatos) }}<span style="font-size: 14px; color: #999;"> ms</span>
          </div>
        </div>

        <div style="padding: 15px; background-color: white; border: 1px solid #eee; border-radius: 4px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Rendering & Painting</div>
          <div style="font-size: 24px; font-weight: bold; color: #ffc107;">
            {{ formatMetrica(metricas.renderingPainting) }}<span style="font-size: 14px; color: #999;"> ms</span>
          </div>
        </div>

        <div style="padding: 15px; background-color: white; border: 1px solid #eee; border-radius: 4px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Bundle Size</div>
          <div style="font-size: 24px; font-weight: bold; color: #dc3545;">
            {{ (metricas.bundleSize / 1024).toFixed(2) }}<span style="font-size: 14px; color: #999;"> KB</span>
          </div>
        </div>

        <div style="padding: 15px; background-color: white; border: 1px solid #eee; border-radius: 4px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Estado Caché</div>
          <div [style]="getCacheStatusStyle()">
            {{ metricas.cacheStatus === 'hit' ? '✓ HIT' : '✗ MISS' }}
          </div>
        </div>

        <div *ngIf="metricas.tiempoCache > 0" style="padding: 15px; background-color: white; border: 1px solid #eee; border-radius: 4px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Tiempo Caché (HIT)</div>
          <div style="font-size: 24px; font-weight: bold; color: #17a2b8;">
            {{ formatMetrica(metricas.tiempoCache) }}<span style="font-size: 14px; color: #999;"> ms</span>
          </div>
        </div>

        <div *ngIf="metricas.tiempoNoCache > 0" style="padding: 15px; background-color: white; border: 1px solid #eee; border-radius: 4px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Tiempo Fetch (MISS)</div>
          <div style="font-size: 24px; font-weight: bold; color: #6c757d;">
            {{ formatMetrica(metricas.tiempoNoCache) }}<span style="font-size: 14px; color: #999;"> ms</span>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class MetricsPanelComponent {
  @Input() metricas: EstadoMetricas | null = null;

  formatMetrica(valor: number): string {
    return valor.toFixed(2);
  }

  getCacheStatusStyle(): string {
    const color = this.metricas?.cacheStatus === 'hit' ? '#28a745' : '#dc3545';
    return `font-size: 18px; font-weight: bold; color: ${color};`;
  }
}
