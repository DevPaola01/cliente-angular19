import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente, MetricasPerfil } from '../models/cliente.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://suggest-eclair-unpack.ngrok-free.dev/api/v1/Client';
  private clientesCacheLista: { datos: Cliente[]; tiempoFetch: number } | null = null;
  private bundleSizeCache: number | null = null;

  private getBundleSize(): number {
    if (this.bundleSizeCache !== null) {
      return this.bundleSizeCache;
    }

    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;

    for (const resource of resources) {
      const name = resource.name.toLowerCase();
      if (name.includes('.js')) {
        const perfResource = resource as PerformanceResourceTiming;
        totalSize += perfResource.transferSize || 0;
      }
    }

    this.bundleSizeCache = totalSize;
    return totalSize;
  }

  async obtenerClientes(): Promise<{
    clientes: Cliente[];
    metricas: MetricasPerfil;
  }> {
    const metricas: MetricasPerfil = {
      scriptingTime: 0,
      transformacionDatos: 0,
      renderingPainting: 0,
      bundleSize: 0,
      cacheStatus: 'miss',
      tiempoCache: 0,
      tiempoNoCache: 0,
      timestamp: Date.now(),
    };

    const startScripting = performance.now();
    let tiempoFetchActual = 0;
    let clientesObtenidos: Cliente[] = [];

    // Verificar si está en caché
    if (this.clientesCacheLista) {
      clientesObtenidos = this.clientesCacheLista.datos;
      tiempoFetchActual = this.clientesCacheLista.tiempoFetch;
      metricas.cacheStatus = 'hit';
      metricas.tiempoCache = tiempoFetchActual;
    } else {
      const startFetch = performance.now();

      try {
        const response = await firstValueFrom(
          this.http.get<any>(this.API_URL)
        );
        const endFetch = performance.now();
        tiempoFetchActual = endFetch - startFetch;

        const startTransformacion = performance.now();
        // Procesamiento real de datos
        let data = response;
        if (Array.isArray(data)) {
          // Validar y procesar cada cliente
          data = data.map((item: any) => ({
            ...item,
            processed: true,
          }));
        }
        const endTransformacion = performance.now();

        metricas.transformacionDatos = endTransformacion - startTransformacion;
        metricas.cacheStatus = 'miss';
        metricas.tiempoNoCache = tiempoFetchActual;

        if (Array.isArray(data)) {
          clientesObtenidos = data;
        } else {
          throw new Error('Respuesta inesperada de la API');
        }

        if (clientesObtenidos.length > 0) {
          this.clientesCacheLista = {
            datos: clientesObtenidos,
            tiempoFetch: tiempoFetchActual,
          };
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Error al consultar la API');
      }
    }

    if (clientesObtenidos.length === 0) {
      throw new Error('No hay clientes disponibles');
    }

    metricas.scriptingTime = performance.now() - startScripting;
    metricas.bundleSize = this.getBundleSize();

    // Obtener paint entries que ya ocurrieron
    const paintEntries = performance.getEntriesByType('paint');
    if (paintEntries.length > 0) {
      const lastPaint = paintEntries[paintEntries.length - 1];
      metricas.renderingPainting = lastPaint.duration || 0;
    }

    // También buscar el LCP (Largest Contentful Paint)
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const lastLCP = lcpEntries[lcpEntries.length - 1] as any;
      metricas.renderingPainting = Math.max(
        metricas.renderingPainting,
        lastLCP.startTime || 0
      );
    }

    return { clientes: clientesObtenidos, metricas };
  }

  limpiarCache(): void {
    this.clientesCacheLista = null;
  }
}
