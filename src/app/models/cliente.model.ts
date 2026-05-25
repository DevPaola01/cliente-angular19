export interface Cliente {
  name: string;
  identificationNumber: string;
  phone: string;
  address: string;
}

export interface ClienteAPI {
  name: string;
  identificationNumber: string;
  phone: string;
  address: string;
}

export interface MetricasPerfil {
  scriptingTime: number;
  transformacionDatos: number;
  renderingPainting: number;
  bundleSize: number;
  cacheStatus: 'hit' | 'miss';
  tiempoCache: number;
  tiempoNoCache: number;
  timestamp: number;
}

export interface EstadoMetricas {
  scriptingTime: number;
  transformacionDatos: number;
  renderingPainting: number;
  bundleSize: number;
  cacheStatus: string;
  tiempoCache: number;
  tiempoNoCache: number;
}
