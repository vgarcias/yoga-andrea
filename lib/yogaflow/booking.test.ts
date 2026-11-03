import { describe, it, expect, beforeEach } from 'vitest'
import { reservar, cancelarReserva, cancelarClase } from './booking'
import type { Store } from './types'

const CLASE = 'c1'

function nuevoStore(opts: { capacidad?: number; alumnas?: Record<string, number> } = {}): Store {
  const alumnas = opts.alumnas ?? { a1: 10 }
  return {
    paquetes: Object.entries(alumnas).map(([id, creditos]) => ({
      id: `p-${id}`,
      alumna_id: id,
      creditos_totales: 10,
      creditos_disponibles: creditos,
      activo: true,
    })),
    clases: [
      {
        id: CLASE,
        instructor_id: 'i1',
        disciplina: 'Vinyasa',
        fecha_hora: new Date('2026-11-10T09:00:00Z'),
        capacidad_maxima: opts.capacidad ?? 12,
        estado: 'programada',
      },
    ],
    reservas: [],
    notificaciones: [],
  }
}

const creditos = (s: Store, alumna: string) =>
  s.paquetes.find((p) => p.alumna_id === alumna)!.creditos_disponibles

function agregarAlumna(s: Store, id: string, cr = 10) {
  s.paquetes.push({ id: `p-${id}`, alumna_id: id, creditos_totales: 10, creditos_disponibles: cr, activo: true })
}

/** Llena la clase con n alumnas (u1..un), cada una con 10 créditos. */
function llenar(n: number, capacidad = n) {
  const alumnas = Object.fromEntries(Array.from({ length: n }, (_, i) => [`u${i + 1}`, 10]))
  const s = nuevoStore({ capacidad, alumnas })
  for (let i = 1; i <= n; i++) reservar(s, CLASE, `u${i}`)
  return s
}

const reservaDe = (s: Store, alumna: string, clase = CLASE) =>
  s.reservas.find((r) => r.alumna_id === alumna && r.clase_id === clase)!

describe('RN-1: reserva estándar', () => {
  let s: Store
  beforeEach(() => {
    s = nuevoStore()
  })

  it('confirma la reserva y descuenta 1 crédito si hay lugar', () => {
    const r = reservar(s, CLASE, 'a1')
    expect(r.ok && r.value.estado).toBe('confirmada')
    expect(r.ok && r.value.posicion_espera).toBeNull()
    expect(creditos(s, 'a1')).toBe(9)
  })

  it('rechaza con SIN_CREDITOS si el saldo es 0 y no crea reserva', () => {
    s = nuevoStore({ alumnas: { a1: 0 } })
    expect(reservar(s, CLASE, 'a1')).toEqual({ ok: false, error: 'SIN_CREDITOS' })
    expect(s.reservas).toHaveLength(0)
  })

  it('rechaza con SIN_CREDITOS si la alumna no tiene paquete activo', () => {
    s.paquetes[0].activo = false
    expect(reservar(s, CLASE, 'a1')).toEqual({ ok: false, error: 'SIN_CREDITOS' })
  })

  it('valida créditos antes que duplicados', () => {
    reservar(s, CLASE, 'a1')
    s.paquetes[0].creditos_disponibles = 0
    expect(reservar(s, CLASE, 'a1')).toEqual({ ok: false, error: 'SIN_CREDITOS' })
  })

  it('rechaza reserva duplicada confirmada sin cobrar dos veces', () => {
    reservar(s, CLASE, 'a1')
    expect(reservar(s, CLASE, 'a1')).toEqual({ ok: false, error: 'RESERVA_DUPLICADA' })
    expect(creditos(s, 'a1')).toBe(9)
    expect(s.reservas).toHaveLength(1)
  })

  it('rechaza duplicado si ya está en lista de espera', () => {
    const lleno = llenar(12)
    agregarAlumna(lleno, 'x')
    reservar(lleno, CLASE, 'x')
    expect(reservar(lleno, CLASE, 'x')).toEqual({ ok: false, error: 'RESERVA_DUPLICADA' })
  })

  it('permite volver a reservar tras haber cancelado', () => {
    const r = reservar(s, CLASE, 'a1')
    if (r.ok) cancelarReserva(s, r.value.id)
    expect(reservar(s, CLASE, 'a1').ok).toBe(true)
    expect(creditos(s, 'a1')).toBe(9)
  })

  it('rechaza clase inexistente o no programada', () => {
    expect(reservar(s, 'nope', 'a1')).toEqual({ ok: false, error: 'CLASE_NO_ENCONTRADA' })
    s.clases[0].estado = 'cancelada'
    expect(reservar(s, CLASE, 'a1')).toEqual({ ok: false, error: 'CLASE_NO_PROGRAMADA' })
    s.clases[0].estado = 'finalizada'
    expect(reservar(s, CLASE, 'a1')).toEqual({ ok: false, error: 'CLASE_NO_PROGRAMADA' })
  })

  it('la reserva 12 se confirma y la 13 entra a lista de espera', () => {
    const lleno = llenar(11, 12)
    agregarAlumna(lleno, 'u12')
    const doce = reservar(lleno, CLASE, 'u12')
    expect(doce.ok && doce.value.estado).toBe('confirmada')

    agregarAlumna(lleno, 'u13')
    const trece = reservar(lleno, CLASE, 'u13')
    expect(trece.ok && trece.value.estado).toBe('lista_espera')
    expect(trece.ok && trece.value.posicion_espera).toBe(1)
  })

  it('lista de espera no descuenta créditos y asigna posiciones consecutivas', () => {
    const lleno = llenar(12)
    const ids = ['w1', 'w2', 'w3']
    ids.forEach((id) => agregarAlumna(lleno, id))
    const posiciones = ids.map((id) => {
      const r = reservar(lleno, CLASE, id)
      return r.ok ? r.value.posicion_espera : null
    })
    expect(posiciones).toEqual([1, 2, 3])
    expect(creditos(lleno, 'w1')).toBe(10)
    expect(creditos(lleno, 'w3')).toBe(10)
  })

  it('exige créditos incluso para entrar a lista de espera', () => {
    const lleno = llenar(12)
    agregarAlumna(lleno, 'z', 0)
    expect(reservar(lleno, CLASE, 'z')).toEqual({ ok: false, error: 'SIN_CREDITOS' })
  })

  it('respeta una capacidad distinta a 12', () => {
    const s2 = llenar(3, 2)
    expect(s2.reservas.map((r) => r.estado)).toEqual(['confirmada', 'confirmada', 'lista_espera'])
  })

  it('las reservas canceladas no cuentan para el aforo', () => {
    const lleno = llenar(12)
    lleno.reservas[0].estado = 'cancelada'
    agregarAlumna(lleno, 'n')
    const r = reservar(lleno, CLASE, 'n')
    expect(r.ok && r.value.estado).toBe('confirmada')
  })

  it('el aforo es independiente por clase', () => {
    const lleno = llenar(12)
    lleno.clases.push({ ...lleno.clases[0], id: 'c2' })
    agregarAlumna(lleno, 'o')
    const r = reservar(lleno, 'c2', 'o')
    expect(r.ok && r.value.estado).toBe('confirmada')
  })
})

describe('RN-2: cancelación de alumna y transición FIFO', () => {
  function conEspera(esperas: Array<[string, number]> = [['w1', 10], ['w2', 10], ['w3', 10]]) {
    const s = llenar(12)
    for (const [id, cr] of esperas) {
      agregarAlumna(s, id)
      reservar(s, CLASE, id)
      // El saldo cambia después de anotarse (p. ej. lo gastó en otra clase).
      s.paquetes.find((p) => p.alumna_id === id)!.creditos_disponibles = cr
    }
    return s
  }

  it('cancela, reembolsa 1 crédito y libera el lugar', () => {
    const s = nuevoStore()
    const r = reservar(s, CLASE, 'a1')
    const c = cancelarReserva(s, r.ok ? r.value.id : '')
    expect(c.ok && c.value.estado).toBe('cancelada')
    expect(creditos(s, 'a1')).toBe(10)
  })

  it('promueve a la primera de la lista de espera y le cobra 1 crédito', () => {
    const s = conEspera()
    cancelarReserva(s, reservaDe(s, 'u1').id)
    const w1 = reservaDe(s, 'w1')
    expect(w1.estado).toBe('confirmada')
    expect(w1.posicion_espera).toBeNull()
    expect(creditos(s, 'w1')).toBe(9)
  })

  it('mantiene el aforo en 12 confirmadas tras la promoción', () => {
    const s = conEspera()
    cancelarReserva(s, reservaDe(s, 'u1').id)
    expect(s.reservas.filter((r) => r.estado === 'confirmada')).toHaveLength(12)
  })

  it('notifica a la alumna promovida', () => {
    const s = conEspera()
    cancelarReserva(s, reservaDe(s, 'u1').id)
    expect(s.notificaciones).toHaveLength(1)
    expect(s.notificaciones[0]).toMatchObject({ alumna_id: 'w1', clase_id: CLASE, tipo: 'lugar_liberado' })
    expect(s.notificaciones[0].mensaje).toContain('Se liberó un lugar')
  })

  it('reindexa el resto de la lista de espera', () => {
    const s = conEspera()
    cancelarReserva(s, reservaDe(s, 'u1').id)
    expect(reservaDe(s, 'w2').posicion_espera).toBe(1)
    expect(reservaDe(s, 'w3').posicion_espera).toBe(2)
  })

  it('respeta FIFO tras varias cancelaciones sucesivas', () => {
    const s = conEspera()
    cancelarReserva(s, reservaDe(s, 'u1').id)
    cancelarReserva(s, reservaDe(s, 'u2').id)
    expect(reservaDe(s, 'w1').estado).toBe('confirmada')
    expect(reservaDe(s, 'w2').estado).toBe('confirmada')
    expect(reservaDe(s, 'w3').estado).toBe('lista_espera')
    expect(reservaDe(s, 'w3').posicion_espera).toBe(1)
  })

  it('sin lista de espera solo reembolsa y no notifica', () => {
    const s = llenar(12)
    cancelarReserva(s, s.reservas[0].id)
    expect(s.notificaciones).toHaveLength(0)
    expect(s.reservas.filter((r) => r.estado === 'confirmada')).toHaveLength(11)
  })

  it('si la primera en espera no tiene créditos, la descarta y promueve a la siguiente', () => {
    const s = conEspera([['w1', 0], ['w2', 10]])
    cancelarReserva(s, reservaDe(s, 'u1').id)
    expect(reservaDe(s, 'w1').estado).toBe('cancelada')
    expect(reservaDe(s, 'w2').estado).toBe('confirmada')
    expect(creditos(s, 'w2')).toBe(9)
    expect(s.notificaciones.map((n) => n.alumna_id)).toEqual(['w2'])
  })

  it('si nadie en espera tiene créditos, el lugar queda libre sin notificar', () => {
    const s = conEspera([['w1', 0]])
    cancelarReserva(s, reservaDe(s, 'u1').id)
    expect(s.reservas.filter((r) => r.estado === 'confirmada')).toHaveLength(11)
    expect(s.notificaciones).toHaveLength(0)
  })

  it('cancelar desde lista de espera no reembolsa, no promueve y reindexa', () => {
    const s = conEspera()
    cancelarReserva(s, reservaDe(s, 'w1').id)
    expect(creditos(s, 'w1')).toBe(10)
    expect(reservaDe(s, 'w1').estado).toBe('cancelada')
    expect(reservaDe(s, 'w2').posicion_espera).toBe(1)
    expect(reservaDe(s, 'w3').posicion_espera).toBe(2)
    expect(s.notificaciones).toHaveLength(0)
  })

  it('cancelar dos veces la misma reserva no reembolsa doble', () => {
    const s = nuevoStore()
    const r = reservar(s, CLASE, 'a1')
    const id = r.ok ? r.value.id : ''
    cancelarReserva(s, id)
    expect(cancelarReserva(s, id)).toEqual({ ok: false, error: 'RESERVA_NO_ACTIVA' })
    expect(creditos(s, 'a1')).toBe(10)
  })

  it('reserva inexistente devuelve RESERVA_NO_ENCONTRADA', () => {
    expect(cancelarReserva(nuevoStore(), 'x')).toEqual({ ok: false, error: 'RESERVA_NO_ENCONTRADA' })
  })

  it('no afecta la lista de espera de otras clases', () => {
    const s = conEspera()
    s.clases.push({ ...s.clases[0], id: 'c2', capacidad_maxima: 1 })
    agregarAlumna(s, 'q')
    reservar(s, 'c2', 'u1')
    reservar(s, 'c2', 'q')
    cancelarReserva(s, reservaDe(s, 'u1', CLASE).id)
    expect(reservaDe(s, 'q', 'c2').estado).toBe('lista_espera')
  })
})

describe('RN-3: cancelación masiva de clase', () => {
  function escenario() {
    const s = llenar(12)
    for (const id of ['w1', 'w2']) {
      agregarAlumna(s, id)
      reservar(s, CLASE, id)
    }
    return s
  }

  it('marca la clase como cancelada', () => {
    const s = escenario()
    cancelarClase(s, CLASE)
    expect(s.clases[0].estado).toBe('cancelada')
  })

  it('devuelve +1 crédito a cada confirmada', () => {
    const s = escenario()
    cancelarClase(s, CLASE)
    for (let i = 1; i <= 12; i++) expect(creditos(s, `u${i}`)).toBe(10)
  })

  it('no entrega créditos extra a la lista de espera', () => {
    const s = escenario()
    cancelarClase(s, CLASE)
    expect(creditos(s, 'w1')).toBe(10)
    expect(creditos(s, 'w2')).toBe(10)
  })

  it('cancela todas las reservas, incluida la lista de espera', () => {
    const s = escenario()
    cancelarClase(s, CLASE)
    expect(s.reservas.every((r) => r.estado === 'cancelada')).toBe(true)
    expect(s.reservas.every((r) => r.posicion_espera === null)).toBe(true)
  })

  it('notifica a confirmadas y en espera (14 notificaciones)', () => {
    const s = escenario()
    const r = cancelarClase(s, CLASE)
    expect(r.ok && r.value.afectadas).toBe(14)
    expect(s.notificaciones).toHaveLength(14)
    expect(new Set(s.notificaciones.map((n) => n.alumna_id)).size).toBe(14)
    expect(s.notificaciones.every((n) => n.tipo === 'clase_cancelada')).toBe(true)
  })

  it('no notifica ni reembolsa a quien ya había cancelado', () => {
    const s = escenario()
    cancelarReserva(s, reservaDe(s, 'u1').id)
    s.notificaciones.length = 0
    const antes = creditos(s, 'u1')
    cancelarClase(s, CLASE)
    expect(creditos(s, 'u1')).toBe(antes)
    expect(s.notificaciones.some((n) => n.alumna_id === 'u1')).toBe(false)
  })

  it('es idempotente: cancelar dos veces no duplica reembolsos', () => {
    const s = escenario()
    cancelarClase(s, CLASE)
    expect(cancelarClase(s, CLASE)).toEqual({ ok: false, error: 'CLASE_NO_PROGRAMADA' })
    expect(creditos(s, 'u1')).toBe(10)
    expect(s.notificaciones).toHaveLength(14)
  })

  it('rechaza clase inexistente', () => {
    expect(cancelarClase(nuevoStore(), 'nope')).toEqual({ ok: false, error: 'CLASE_NO_ENCONTRADA' })
  })

  it('una clase sin reservas se cancela con 0 afectadas', () => {
    const s = nuevoStore()
    const r = cancelarClase(s, CLASE)
    expect(r.ok && r.value.afectadas).toBe(0)
    expect(s.clases[0].estado).toBe('cancelada')
  })

  it('después de cancelada, no se puede reservar', () => {
    const s = nuevoStore()
    cancelarClase(s, CLASE)
    expect(reservar(s, CLASE, 'a1')).toEqual({ ok: false, error: 'CLASE_NO_PROGRAMADA' })
  })

  it('no toca otras clases', () => {
    const s = escenario()
    s.clases.push({ ...s.clases[0], id: 'c2', estado: 'programada' })
    reservar(s, 'c2', 'u1')
    cancelarClase(s, CLASE)
    expect(reservaDe(s, 'u1', 'c2').estado).toBe('confirmada')
    expect(s.clases[1].estado).toBe('programada')
  })
})
