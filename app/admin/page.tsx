'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  LayoutDashboard,
  Leaf,
  ListOrdered,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const upcoming = [
  { time: '7:00 am', name: 'Vinyasa Flow', teacher: 'Mariana López', attendees: '8 / 12', tone: 'sage' },
  { time: '8:30 am', name: 'Hatha Yoga', teacher: 'Andrea García', attendees: '5 / 12', tone: 'lavender' },
  { time: '6:30 pm', name: 'Yoga Restaurativo', teacher: 'Ana Sofía', attendees: '12 / 12', tone: 'peach' },
]

const members = [
  { initials: 'SG', name: 'Sofía Gómez', package: '10 clases', status: 'Activa', color: 'bg-[#e3cfc2] text-[#805e4d]' },
  { initials: 'MR', name: 'María Rivera', package: 'Mensual ilimitado', status: 'Activa', color: 'bg-[#dcecdf] text-[#527e62]' },
  { initials: 'LP', name: 'Lucía Pérez', package: '5 clases', status: 'Por renovar', color: 'bg-[#e9e4ee] text-[#766c86]' },
  { initials: 'CM', name: 'Carlos Méndez', package: '10 clases', status: 'Activa', color: 'bg-[#f1e1d8] text-[#9a705d]' },
]

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState('Resumen')
  const [showAll, setShowAll] = useState(false)
  const [attendanceMarked, setAttendanceMarked] = useState(false)
  const [cancelledClass, setCancelledClass] = useState(false)
  const [notificationsSent, setNotificationsSent] = useState(false)

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-[#27332f]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-[#e4e8df] bg-[#fbfcf8] px-5 py-7 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#dcecdf] text-[#527e62]"><Leaf /></div>
            <div><p className="font-serif text-xl font-semibold tracking-tight">Andrea Wellness</p><p className="text-[11px] uppercase tracking-[0.2em] text-[#8c9a92]">Administración</p></div>
          </div>
          <nav className="mt-14 flex flex-col gap-2" aria-label="Navegación de administración">
            {[['Resumen', LayoutDashboard], ['Calendario', CalendarDays], ['Alumnas', Users], ['Paquetes', CircleDollarSign]].map(([label, Icon]) => <button key={label as string} onClick={() => setActiveNav(label as string)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${activeNav === label ? 'bg-[#e5f0e6] font-medium text-[#4f7d5d]' : 'text-[#78867d] hover:bg-[#f0f4ed]'}`}><Icon className="size-[18px]" />{label as string}</button>)}
          </nav>
          <div className="mt-auto flex flex-col gap-2"><button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#78867d] hover:bg-[#f0f4ed]"><Settings className="size-[18px]" />Configuración</button><div className="mt-3 flex items-center gap-3 border-t border-[#e4e8df] px-2 pt-5"><div className="flex size-9 items-center justify-center rounded-full bg-[#dcecdf] text-sm font-medium text-[#527e62]">AG</div><div><p className="text-sm font-medium">Andrea García</p><p className="text-xs text-[#8c9a92]">Administradora</p></div></div></div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[#e4e8df] bg-[#fbfcf8]/80 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-12"><div><p className="text-xs uppercase tracking-[0.16em] text-[#92a097]">Panel de control</p><h1 className="font-serif text-2xl">Buenos días, Andrea</h1></div><div className="flex items-center gap-3"><button className="hidden items-center gap-2 rounded-full border border-[#e1e7df] px-3 py-2 text-xs text-[#718078] sm:flex"><CalendarDays className="size-3.5" />18 — 24 mayo <ChevronDown className="size-3" /></button><div className="flex size-9 items-center justify-center rounded-full bg-[#dcecdf] text-xs font-medium text-[#527e62]">AG</div></div></header>

          <section className="px-5 py-8 sm:px-8 lg:px-12 lg:py-10"><div className="mx-auto max-w-[1120px]">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-[#799582]">Lunes, 18 de mayo de 2026</p><h2 className="font-serif text-4xl tracking-tight sm:text-5xl">Tu estudio en equilibrio.</h2><p className="mt-2 text-sm text-[#849087]">Aquí tienes una vista general de lo que está pasando esta semana.</p></div><Button className="w-fit rounded-full bg-[#537f61] px-5 text-white hover:bg-[#416d50]"><Plus data-icon="inline-start" />Nueva clase</Button></div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-2xl bg-[#dcecdf] p-5"><p className="text-xs uppercase tracking-[0.16em] text-[#638b6c]">Alumnas activas</p><p className="mt-6 font-serif text-4xl text-[#355a42]">48</p><p className="mt-1 text-xs text-[#72927a]">+8.4% este mes</p></div><div className="rounded-2xl border border-[#e5e9e1] bg-[#fffefa] p-5"><p className="text-xs uppercase tracking-[0.16em] text-[#8b958c]">Clases esta semana</p><p className="mt-6 font-serif text-4xl">24</p><p className="mt-1 text-xs text-[#72927a]">82% ocupación promedio</p></div><div className="rounded-2xl border border-[#e5e9e1] bg-[#fffefa] p-5"><p className="text-xs uppercase tracking-[0.16em] text-[#8b958c]">Ingresos del mes</p><p className="mt-6 font-serif text-4xl">$2,840</p><p className="mt-1 text-xs text-[#72927a]">+12.6% vs. abril</p></div><div className="rounded-2xl border border-[#e5e9e1] bg-[#fffefa] p-5"><p className="text-xs uppercase tracking-[0.16em] text-[#8b958c]">Por renovar</p><p className="mt-6 font-serif text-4xl">6</p><p className="mt-1 text-xs text-[#b78062]">Requieren seguimiento</p></div></div>

            <div className="mt-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]"><section className="rounded-2xl border border-[#e4e8df] bg-[#fffefa] p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.16em] text-[#92a097]">Agenda de hoy</p><h2 className="mt-1 font-serif text-2xl">Las próximas clases</h2></div><button className="text-[#9ba79f]" aria-label="Más opciones"><MoreHorizontal className="size-5" /></button></div><div className="flex flex-col gap-3">{upcoming.map((item) => <div key={item.time} className="flex items-center gap-4 rounded-xl border border-[#edf0ea] p-3"><div className={`flex size-12 shrink-0 flex-col items-center justify-center rounded-xl ${item.tone === 'sage' ? 'bg-[#dcecdf] text-[#638b6c]' : item.tone === 'lavender' ? 'bg-[#e9e4ee] text-[#766c86]' : 'bg-[#f1e1d8] text-[#9a705d]'}`}><Clock3 className="size-3.5" /><span className="mt-0.5 text-[10px] font-medium">{item.time}</span></div><div className="min-w-0 flex-1"><p className="font-serif text-lg">{item.name}</p><p className="text-xs text-[#87938b]">{item.teacher}</p></div><div className="hidden text-right sm:block"><p className="text-sm font-medium">{item.attendees}</p><p className="text-[11px] text-[#9da8a0]">inscritas</p></div><button className="rounded-full border border-[#dfe7df] px-3 py-1.5 text-xs text-[#668a6e]">Gestionar</button></div>)}</div><button className="mt-5 flex items-center gap-1 text-xs font-medium text-[#668a6e]">Ver calendario completo <ChevronRight className="size-3" /></button></section>

              <section className="rounded-2xl border border-[#e4e8df] bg-[#fffefa] p-5 sm:p-6"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.16em] text-[#92a097]">Alumnas recientes</p><h2 className="mt-1 font-serif text-2xl">Tu comunidad</h2></div><button aria-label="Buscar alumnas" className="text-[#9ba79f]"><Search className="size-4" /></button></div><div className="flex flex-col gap-4">{members.slice(0, showAll ? 4 : 3).map((member) => <div key={member.name} className="flex items-center gap-3"><div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${member.color}`}>{member.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{member.name}</p><p className="truncate text-xs text-[#9aa59d]">{member.package}</p></div><span className={`text-[11px] ${member.status === 'Por renovar' ? 'text-[#b78062]' : 'text-[#7d9582]'}`}>{member.status}</span></div>)}</div><button onClick={() => setShowAll(!showAll)} className="mt-6 flex items-center gap-1 border-t border-[#edf0ea] pt-4 text-xs font-medium text-[#668a6e]">{showAll ? 'Mostrar menos' : 'Ver todas las alumnas'} <ChevronRight className="size-3" /></button></section></div>

            <section className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]"><div className="rounded-2xl border border-[#e4e8df] bg-[#fffefa] p-5 sm:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-[#92a097]">Control de operación</p><h2 className="mt-1 font-serif text-2xl">Aforo y asistencia</h2><p className="mt-1 text-sm text-[#87938b]">Vinyasa Flow · hoy a las 7:00 am</p></div><span className="rounded-full bg-[#e5f0e6] px-3 py-1 text-xs font-medium text-[#527e62]">8 / 12 lugares</span></div><div className="h-2 overflow-hidden rounded-full bg-[#edf0ea]"><div className="h-full w-2/3 rounded-full bg-[#6f9c79]" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={() => setAttendanceMarked(!attendanceMarked)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${attendanceMarked ? 'border-[#b9d3bd] bg-[#e5f0e6] text-[#527e62]' : 'border-[#dfe7df] text-[#668a6e] hover:bg-[#f5f8f3]'}`}><UserCheck className="size-4" />{attendanceMarked ? 'Asistencia registrada' : 'Pasar lista'}</button><button onClick={() => setCancelledClass(!cancelledClass)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${cancelledClass ? 'border-[#e5c8b8] bg-[#f9ece5] text-[#a26d55]' : 'border-[#dfe7df] text-[#9a705d] hover:bg-[#fbf4ef]'}`}><XCircle className="size-4" />{cancelledClass ? 'Clase cancelada' : 'Cancelar clase'}</button></div></div><div className="rounded-2xl border border-[#e4e8df] bg-[#fffefa] p-5 sm:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-[#92a097]">Lista de espera</p><h2 className="mt-1 font-serif text-2xl">2 alumnas esperando</h2></div><ListOrdered className="size-5 text-[#9ba79f]" /></div><div className="flex flex-col gap-3"><div className="flex items-center gap-3 rounded-xl bg-[#f7f5ef] px-3 py-2.5"><span className="flex size-6 items-center justify-center rounded-full bg-[#e9e4ee] text-xs font-medium text-[#766c86]">1</span><span className="flex-1 text-sm">Valentina Ruiz</span><span className="text-xs text-[#9aa59d]">desde 6:42</span></div><div className="flex items-center gap-3 rounded-xl bg-[#f7f5ef] px-3 py-2.5"><span className="flex size-6 items-center justify-center rounded-full bg-[#e9e4ee] text-xs font-medium text-[#766c86]">2</span><span className="flex-1 text-sm">Camila Torres</span><span className="text-xs text-[#9aa59d]">desde 6:55</span></div></div><button onClick={() => setNotificationsSent(!notificationsSent)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe7df] px-4 py-2.5 text-xs font-medium text-[#668a6e] hover:bg-[#f5f8f3]"><Bell className="size-4" />{notificationsSent ? 'Notificaciones enviadas' : 'Avisar cuando haya un lugar'}</button></div></section>

            {cancelledClass && <div role="status" className="mt-4 flex items-start gap-3 rounded-2xl border border-[#e5c8b8] bg-[#f9ece5] px-4 py-3 text-sm text-[#8f624f]"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><p><strong>Clase cancelada.</strong> Se liberarán los créditos de las 8 alumnas inscritas y se enviará una notificación automática.</p></div>}

            <div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="flex items-center justify-between rounded-2xl bg-[#ece9df] px-5 py-4"><div><p className="text-xs uppercase tracking-[0.14em] text-[#8f9288]">Resumen financiero</p><p className="mt-1 text-sm text-[#5d6258]">Consulta tus ingresos y renovaciones.</p></div><Button variant="outline" size="sm" className="rounded-full border-[#d7d8ce] bg-transparent text-[#6c806b]"><Download data-icon="inline-start" />Exportar</Button></div><div className="flex items-center justify-between rounded-2xl bg-[#e9e4ee] px-5 py-4"><div><p className="text-xs uppercase tracking-[0.14em] text-[#857a93]">¿Necesitas ayuda?</p><p className="mt-1 text-sm text-[#655e6d]">Estamos aquí para acompañarte.</p></div><button className="text-xs font-medium text-[#766c86]">Contactar soporte <ChevronRight className="ml-1 inline size-3" /></button></div></div>
          </div></section>
        </div>
      </div>
    </main>
  )
}
