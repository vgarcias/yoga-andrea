import type { Reserva, Resultado, Store, Paquete } from './types'

let seq = 0
const nextId = () => `booking-${++seq}`

const paqueteActivo = (s: Store, alumnaId: string): Paquete | undefined =>
  s.paquetes.find((p) => p.alumna_id === alumnaId && p.activo)

const esActiva = (r: Reserva) => r.estado === 'confirmada' || r.estado === 'lista_espera'

/** Reindexa la lista de espera de una clase a 1..n en orden de llegada. */
function reindexarEspera(s: Store, claseId: string) {
  s.reservas
    .filter((r) => r.clase_id === claseId && r.estado === 'lista_espera')
    .sort((a, b) => (a.posicion_espera ?? 0) - (b.posicion_espera ?? 0))
    .forEach((r, i) => {
      r.posicion_espera = i + 1
    })
}

/** RN-1: reserva estándar. */
export function reservar(s: Store, claseId: string, alumnaId: string): Resultado<Reserva> {
  const clase = s.clases.find((c) => c.id === claseId)
  if (!clase) return { ok: false, error: 'CLASE_NO_ENCONTRADA' }
  if (clase.estado !== 'programada') return { ok: false, error: 'CLASE_NO_PROGRAMADA' }

  const paquete = paqueteActivo(s, alumnaId)
  if (!paquete || paquete.creditos_disponibles <= 0) return { ok: false, error: 'SIN_CREDITOS' }

  const duplicada = s.reservas.some(
    (r) => r.clase_id === claseId && r.alumna_id === alumnaId && esActiva(r),
  )
  if (duplicada) return { ok: false, error: 'RESERVA_DUPLICADA' }

  const confirmadas = s.reservas.filter(
    (r) => r.clase_id === claseId && r.estado === 'confirmada',
  ).length

  const reserva: Reserva = {
    id: nextId(),
    clase_id: claseId,
    alumna_id: alumnaId,
    estado: 'confirmada',
    posicion_espera: null,
    created_at: new Date(),
  }

  if (confirmadas < clase.capacidad_maxima) {
    paquete.creditos_disponibles -= 1
  } else {
    reserva.estado = 'lista_espera'
    reserva.posicion_espera =
      s.reservas.filter((r) => r.clase_id === claseId && r.estado === 'lista_espera').length + 1
  }

  s.reservas.push(reserva)
  return { ok: true, value: reserva }
}

/**
 * RN-2: cancelación voluntaria y promoción FIFO.
 * Supuestos no definidos en el documento:
 * - Cancelar desde lista de espera no reembolsa (nunca se cobró) y reindexa.
 * - Si la primera en espera ya no tiene créditos, se descarta (cancelada) y se intenta con la siguiente.
 */
export function cancelarReserva(s: Store, reservaId: string): Resultado<Reserva> {
  const reserva = s.reservas.find((r) => r.id === reservaId)
  if (!reserva) return { ok: false, error: 'RESERVA_NO_ENCONTRADA' }
  if (!esActiva(reserva)) return { ok: false, error: 'RESERVA_NO_ACTIVA' }

  const eraConfirmada = reserva.estado === 'confirmada'
  reserva.estado = 'cancelada'
  reserva.posicion_espera = null

  if (!eraConfirmada) {
    reindexarEspera(s, reserva.clase_id)
    return { ok: true, value: reserva }
  }

  const paquete = paqueteActivo(s, reserva.alumna_id)
  if (paquete) paquete.creditos_disponibles += 1

  for (;;) {
    const siguiente = s.reservas
      .filter((r) => r.clase_id === reserva.clase_id && r.estado === 'lista_espera')
      .sort((a, b) => (a.posicion_espera ?? 0) - (b.posicion_espera ?? 0))[0]
    if (!siguiente) break

    const pq = paqueteActivo(s, siguiente.alumna_id)
    if (pq && pq.creditos_disponibles > 0) {
      siguiente.estado = 'confirmada'
      siguiente.posicion_espera = null
      pq.creditos_disponibles -= 1
      s.notificaciones.push({
        alumna_id: siguiente.alumna_id,
        clase_id: siguiente.clase_id,
        tipo: 'lugar_liberado',
        mensaje: '¡Buenas noticias! Se liberó un lugar y entraste a la clase',
      })
      break
    }
    siguiente.estado = 'cancelada'
    siguiente.posicion_espera = null
  }

  reindexarEspera(s, reserva.clase_id)
  return { ok: true, value: reserva }
}

/** RN-3: cancelación masiva de una clase por administradora o instructora. */
export function cancelarClase(s: Store, claseId: string): Resultado<{ afectadas: number }> {
  const clase = s.clases.find((c) => c.id === claseId)
  if (!clase) return { ok: false, error: 'CLASE_NO_ENCONTRADA' }
  if (clase.estado !== 'programada') return { ok: false, error: 'CLASE_NO_PROGRAMADA' }

  clase.estado = 'cancelada'
  const activas = s.reservas.filter((r) => r.clase_id === claseId && esActiva(r))

  for (const r of activas) {
    if (r.estado === 'confirmada') {
      const paquete = paqueteActivo(s, r.alumna_id)
      if (paquete) paquete.creditos_disponibles += 1
    }
    r.estado = 'cancelada'
    r.posicion_espera = null
    s.notificaciones.push({
      alumna_id: r.alumna_id,
      clase_id: claseId,
      tipo: 'clase_cancelada',
      mensaje: `La clase de ${clase.disciplina} fue cancelada. Tu crédito fue devuelto si aplicaba.`,
    })
  }

  return { ok: true, value: { afectadas: activas.length } }
}
