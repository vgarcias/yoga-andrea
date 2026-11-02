'use client'

import { useState } from 'react'
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Home,
  Leaf,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const classes = [
  { id: 1, day: 'LUN', date: '18', time: '7:00 am', name: 'Vinyasa Flow', teacher: 'Mariana López', spots: '8 / 12', status: 'available', tone: 'lavender' },
  { id: 2, day: 'MAR', date: '19', time: '6:30 pm', name: 'Yoga Restaurativo', teacher: 'Ana Sofía', spots: '12 / 12', status: 'waitlist', tone: 'peach' },
  { id: 3, day: 'MIÉ', date: '20', time: '8:00 am', name: 'Hatha Yoga', teacher: 'Mariana López', spots: '5 / 12', status: 'available', tone: 'sage' },
  { id: 4, day: 'JUE', date: '21', time: '7:00 pm', name: 'Vinyasa Flow', teacher: 'Andrea García', spots: '9 / 12', status: 'available', tone: 'sand' },
]

const activity = [
  { text: 'Reservaste Vinyasa Flow', time: 'Hoy, 9:42 am', icon: Check, color: 'mint' },
  { text: 'Se descontó 1 clase de tu paquete', time: 'Hoy, 9:42 am', icon: Leaf, color: 'lavender' },
  { text: 'Asististe a Yoga Restaurativo', time: 'Jue, 16 de mayo', icon: Users, color: 'peach' },
]

export default function Page() {
  const [activeNav, setActiveNav] = useState('Inicio')
  const [reserved, setReserved] = useState<number[]>([1])
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)

  const toggleReservation = (id: number) => {
    setReserved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-[#27332f]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-[#e4e8df] bg-[#fbfcf8] px-5 py-7 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#dcecdf] text-[#527e62]"><Leaf /></div>
            <div><p className="font-serif text-xl font-semibold tracking-tight">Andrea Wellness</p><p className="text-[11px] uppercase tracking-[0.2em] text-[#8c9a92]">Yoga studio</p></div>
          </div>
          <nav className="mt-14 flex flex-col gap-2" aria-label="Navegación principal">
            {[
              { label: 'Inicio', icon: Home, href: '/' }, { label: 'Mis clases', icon: CalendarDays, href: '/calendario' }, { label: 'Mi paquete', icon: Leaf, href: '/paquetes' }, { label: 'Mensajes', icon: MessageCircle, href: '/mensajes' },
            ].map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveNav(label)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${activeNav === label ? 'bg-[#e5f0e6] font-medium text-[#4f7d5d]' : 'text-[#78867d] hover:bg-[#f0f4ed]'}`}><Icon className="size-[18px]" />{label}{label === 'Mensajes' && <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-[#d7eadb] text-[10px] text-[#4f7d5d]">2</span>}</button>)}
          </nav>
          <div className="mt-auto flex flex-col gap-2">
            <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#78867d] hover:bg-[#f0f4ed]"><Settings className="size-[18px]" />Configuración</button>
            <div className="mt-3 flex items-center gap-3 border-t border-[#e4e8df] px-2 pt-5"><div className="flex size-9 items-center justify-center rounded-full bg-[#e3cfc2] text-sm font-medium text-[#805e4d]">SG</div><div className="min-w-0"><p className="truncate text-sm font-medium">Sofía Gómez</p><p className="truncate text-xs text-[#8c9a92]">Alumna</p></div><button aria-label="Cerrar sesión" className="ml-auto text-[#9eaaa2]"><LogOut className="size-4" /></button></div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[#e4e8df] bg-[#fbfcf8]/80 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-12">
            <button className="flex items-center gap-3 lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu className="size-5" /><span className="font-serif text-lg">Andrea Wellness</span></button>
            <div className="hidden text-sm text-[#8c9a92] lg:block">Lunes, 18 de mayo de 2026</div>
            <div className="flex items-center gap-3"><button className="relative flex size-9 items-center justify-center rounded-full text-[#7c8b82] hover:bg-[#eef3eb]" aria-label="Notificaciones"><Bell className="size-[18px]" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#d58c70]" /></button><div className="flex size-9 items-center justify-center rounded-full bg-[#e3cfc2] text-xs font-medium text-[#805e4d]">SG</div></div>
          </header>
          {menuOpen && <div className="absolute left-0 right-0 z-10 border-b border-[#e4e8df] bg-[#fbfcf8] p-4 shadow-sm lg:hidden"><div className="flex flex-col gap-1">{['Inicio', 'Mis clases', 'Mi paquete', 'Mensajes'].map((item) => <button key={item} onClick={() => { setActiveNav(item); setMenuOpen(false) }} className="rounded-lg px-3 py-3 text-left text-sm hover:bg-[#eef3eb]">{item}</button>)}</div></div>}

          <section className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-[1120px]">
              <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-[#799582]">Buenos días, Sofía</p><h1 className="font-serif text-4xl tracking-tight text-[#27332f] sm:text-5xl">Tu práctica, <em className="font-normal text-[#6e997a]">a tu ritmo.</em></h1><p className="mt-3 max-w-md text-sm leading-6 text-[#849087]">Todo lo que necesitas para reservar tus clases y mantener tu bienestar en equilibrio.</p></div><Button className="w-fit rounded-full bg-[#537f61] px-5 text-white hover:bg-[#416d50]" onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}><Plus data-icon="inline-start" />Reservar una clase</Button></div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#dcecdf] p-5"><div className="mb-7 flex items-start justify-between"><span className="text-xs font-medium uppercase tracking-[0.16em] text-[#638b6c]">Clases disponibles</span><Leaf className="size-[18px] text-[#71997a]" /></div><p className="font-serif text-4xl text-[#355a42]">7 <span className="font-sans text-sm text-[#6e9075]">/ 10</span></p><p className="mt-1 text-xs text-[#72927a]">Paquete activo · vence en 42 días</p></div>
                <div className="rounded-2xl border border-[#e5e9e1] bg-[#fffefa] p-5"><div className="mb-7 flex items-start justify-between"><span className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b958c]">Próxima clase</span><CalendarDays className="size-[18px] text-[#a6b1a9]" /></div><p className="font-serif text-2xl text-[#35413b]">Vinyasa Flow</p><p className="mt-1 text-xs text-[#849087]">Hoy · 7:00 am · con Mariana</p></div>
                <div className="rounded-2xl border border-[#e5e9e1] bg-[#fffefa] p-5"><div className="mb-7 flex items-start justify-between"><span className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b958c]">Este mes</span><span className="text-[10px] text-[#9ca79f]">MAYO 2026</span></div><p className="font-serif text-4xl text-[#35413b]">4 <span className="font-sans text-sm text-[#849087]">clases</span></p><p className="mt-1 text-xs text-[#849087]">Tu constancia va creciendo</p></div>
              </div>

              <div id="schedule" className="mt-12 grid gap-8 xl:grid-cols-[1fr_320px]">
                <section><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#92a097]">Agenda semanal</p><h2 className="mt-1 font-serif text-2xl">Encuentra tu momento</h2></div><button className="flex items-center gap-1 text-xs font-medium text-[#668a6e]">Ver calendario <ChevronRight className="size-3" /></button></div><div className="flex gap-2 overflow-x-auto pb-2">{classes.map((item) => <article key={item.id} className={`min-w-[220px] flex-1 rounded-2xl border border-[#e4e8df] bg-[#fffefa] p-4 transition-shadow hover:shadow-md ${reserved.includes(item.id) ? 'ring-1 ring-[#a8c6ac]' : ''}`}><div className="mb-5 flex items-start justify-between"><div className={`flex size-12 flex-col items-center justify-center rounded-xl ${item.tone === 'lavender' ? 'bg-[#e9e4ee] text-[#766c86]' : item.tone === 'peach' ? 'bg-[#f1e1d8] text-[#9a705d]' : item.tone === 'sage' ? 'bg-[#dcecdf] text-[#638b6c]' : 'bg-[#eee8d5] text-[#937f4e]'}`}><span className="text-[10px] font-semibold">{item.day}</span><span className="font-serif text-xl leading-5">{item.date}</span></div><button aria-label="Más opciones" className="text-[#a5afa8]"><MoreHorizontal className="size-4" /></button></div><p className="font-serif text-lg">{item.name}</p><p className="mt-1 text-xs text-[#87938b]">{item.time} · {item.teacher}</p><div className="mt-5 flex items-center justify-between border-t border-[#edf0ea] pt-4"><span className={`text-[11px] ${item.status === 'waitlist' ? 'text-[#b78062]' : 'text-[#7d9582]'}`}>{item.status === 'waitlist' ? 'Lista de espera' : `${item.spots} lugares`}</span><Button size="sm" variant={reserved.includes(item.id) ? 'secondary' : 'outline'} className="h-8 rounded-full px-3 text-xs" onClick={() => item.status !== 'waitlist' && toggleReservation(item.id)}>{reserved.includes(item.id) ? <><Check data-icon="inline-start" />Reservada</> : item.status === 'waitlist' ? 'Anotarme' : 'Reservar'}</Button></div></article>)}</div></section>
                <aside className="rounded-2xl border border-[#e4e8df] bg-[#fffefa] p-5"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#92a097]">Tu actividad</p><h2 className="mt-1 font-serif text-xl">Últimos movimientos</h2></div><button aria-label="Buscar" className="text-[#9ba79f]"><Search className="size-4" /></button></div><div className="flex flex-col gap-4">{activity.slice(0, showAllActivity ? 3 : 2).map(({ text, time, icon: Icon, color }) => <div key={text} className="flex gap-3"><div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${color === 'mint' ? 'bg-[#dcecdf] text-[#668e6f]' : color === 'lavender' ? 'bg-[#e9e4ee] text-[#766c86]' : 'bg-[#f1e1d8] text-[#9a705d]'}`}><Icon className="size-3.5" /></div><div><p className="text-xs leading-5 text-[#526158]">{text}</p><p className="text-[11px] text-[#a0aaa3]">{time}</p></div></div>)}</div><button onClick={() => setShowAllActivity(!showAllActivity)} className="mt-6 flex w-full items-center justify-center gap-1 border-t border-[#edf0ea] pt-4 text-xs font-medium text-[#668a6e]">{showAllActivity ? 'Mostrar menos' : 'Ver historial completo'} <ChevronRight className="size-3" /></button></aside>
              </div>

              <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#ece9df] px-6 py-5 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><div className="flex size-10 items-center justify-center rounded-full bg-[#f7f4eb] text-[#8c866d]"><MessageCircle className="size-4" /></div><div><p className="text-sm font-medium text-[#5d6258]">¿Necesitas ayuda con tu reserva?</p><p className="text-xs text-[#8f9288]">Estamos aquí para acompañarte.</p></div></div><button className="text-xs font-medium text-[#6c806b]">Escribir a Andrea Wellness <ChevronRight className="ml-1 inline size-3" /></button></div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
