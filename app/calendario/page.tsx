'use client'

import { ArrowLeft, CalendarDays, Check, Clock3, Leaf } from 'lucide-react'
import Link from 'next/link'

const days = ['Lun 18', 'Mar 19', 'Mié 20', 'Jue 21', 'Vie 22']
const classes = [
  ['7:00 am', 'Vinyasa Flow', 'Mariana López', '8 / 12'],
  ['8:00 am', 'Hatha Yoga', 'Andrea García', '5 / 12'],
  ['6:30 pm', 'Yoga Restaurativo', 'Ana Sofía', '12 / 12'],
]

export default function CalendarioPage() {
  return <main className="min-h-screen bg-[#f7f8f3] text-[#27332f]"><header className="border-b border-[#e4e8df] bg-[#fbfcf8] px-5 py-5 sm:px-10"><div className="mx-auto flex max-w-5xl items-center justify-between"><Link href="/" className="flex items-center gap-3 text-sm text-[#668a6e]"><ArrowLeft className="size-4" />Volver a inicio</Link><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-xl bg-[#dcecdf] text-[#527e62]"><Leaf className="size-4" /></div><span className="font-serif text-lg">Andrea Wellness</span></div></div></header><section className="mx-auto max-w-5xl px-5 py-10 sm:px-10"><p className="text-xs uppercase tracking-[0.16em] text-[#92a097]">Alumna · agenda semanal</p><h1 className="mt-2 font-serif text-4xl">Tu calendario</h1><p className="mt-2 text-sm text-[#849087]">Elige una clase para reservar tu próximo momento de bienestar.</p><div className="mt-8 flex gap-2 overflow-x-auto">{days.map((day, i) => <button key={day} className={`min-w-[100px] rounded-2xl border px-4 py-3 text-left ${i === 0 ? 'border-[#a8c6ac] bg-[#dcecdf] text-[#527e62]' : 'border-[#e4e8df] bg-[#fffefa] text-[#87938b]'}`}><CalendarDays className="mb-3 size-4" /><span className="text-sm font-medium">{day}</span></button>)}</div><div className="mt-8 flex flex-col gap-3">{classes.map(([time, name, teacher, spots], i) => <div key={name} className="flex items-center gap-4 rounded-2xl border border-[#e4e8df] bg-[#fffefa] p-4 sm:p-5"><div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#e9e4ee] text-[#766c86]"><Clock3 className="size-4" /><span className="mt-1 text-[10px]">{time}</span></div><div className="min-w-0 flex-1"><h2 className="font-serif text-xl">{name}</h2><p className="text-xs text-[#87938b]">{teacher} · {spots} lugares</p></div><button className="rounded-full border border-[#c9ddcc] px-4 py-2 text-xs font-medium text-[#668a6e]">{i === 0 ? <><Check className="mr-1 inline size-3" />Reservada</> : spots === '12 / 12' ? 'Lista de espera' : 'Reservar'}</button></div>)}</div></section></main>
}
