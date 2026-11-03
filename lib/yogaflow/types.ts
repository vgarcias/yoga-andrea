export type Rol = 'administrador' | 'instructora' | 'alumna'
export type EstadoClase = 'programada' | 'cancelada' | 'finalizada'
export type EstadoReserva = 'confirmada' | 'lista_espera' | 'cancelada'

export interface Paquete {
  id: string
  alumna_id: string
  creditos_totales: number
  creditos_disponibles: number
  activo: boolean
}

export interface Clase {
  id: string
  instructor_id: string
  disciplina: string
  fecha_hora: Date
  capacidad_maxima: number
  estado: EstadoClase
}

export interface Reserva {
  id: string
  clase_id: string
  alumna_id: string
  estado: EstadoReserva
  posicion_espera: number | null
  created_at: Date
}

export interface Notificacion {
  alumna_id: string
  clase_id: string
  tipo: 'lugar_liberado' | 'clase_cancelada'
  mensaje: string
}

export interface Store {
  paquetes: Paquete[]
  clases: Clase[]
  reservas: Reserva[]
  notificaciones: Notificacion[]
}

export type ErrorReserva =
  | 'CLASE_NO_ENCONTRADA'
  | 'CLASE_NO_PROGRAMADA'
  | 'SIN_CREDITOS'
  | 'RESERVA_DUPLICADA'
  | 'RESERVA_NO_ENCONTRADA'
  | 'RESERVA_NO_ACTIVA'

export type Resultado<T> = { ok: true; value: T } | { ok: false; error: ErrorReserva }
