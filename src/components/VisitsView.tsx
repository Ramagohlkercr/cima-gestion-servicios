import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Visit, VisitStatus } from '../types';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  X,
  Filter,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Calendar as CalendarIcon,
} from 'lucide-react';

export const VisitsView: React.FC = () => {
  const {
    currentRole,
    currentUser,
    visits,
    clients,
    updateVisitStatus,
    registerCheckIn,
    registerCheckOut,
    verifyVisit,
    selectedVisitId,
    setSelectedVisitId,
  } = useApp();

  // Week range filter (Default to Week 2 which includes Nov 12)
  const [selectedWeek, setSelectedWeek] = useState<number>(2); // 1, 2, 3, 4, 5
  const [viewMode, setViewMode] = useState<'matrix' | 'daily'>('matrix');
  const [selectedDayForDaily, setSelectedDayForDaily] = useState<number>(12);

  // Modal notes input
  const [modalNotes, setModalNotes] = useState('');

  const weekRanges = [
    { week: 1, label: 'Sem 1 (1 - 7 Nov)', start: 1, end: 7 },
    { week: 2, label: 'Sem 2 (8 - 14 Nov · Hoy)', start: 8, end: 14 },
    { week: 3, label: 'Sem 3 (15 - 21 Nov)', start: 15, end: 21 },
    { week: 4, label: 'Sem 4 (22 - 28 Nov)', start: 22, end: 28 },
    { week: 5, label: 'Sem 5 (29 - 30 Nov)', start: 29, end: 30 },
  ];

  const currentRange = weekRanges.find((w) => w.week === selectedWeek) || weekRanges[1];

  // Days in selected range
  const daysInRange: number[] = [];
  for (let d = currentRange.start; d <= currentRange.end; d++) {
    daysInRange.push(d);
  }

  const getDayName = (day: number) => {
    // Nov 2026: 1 is Sun, 2 is Mon, ..., 12 is Thu
    const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const date = new Date(2026, 10, day);
    return names[date.getDay()];
  };

  const activeVisit = visits.find((v) => v.id === selectedVisitId);

  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case 'Verificada':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
          dot: 'bg-emerald-600',
          icon: <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />,
          short: 'VERIF',
        };
      case 'Declarada':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
          dot: 'bg-amber-500',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          short: 'DECLAR',
        };
      case 'Programada':
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
          dot: 'bg-blue-400',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />,
          short: 'PROG',
        };
      case 'Ausente':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100',
          dot: 'bg-rose-500',
          icon: <X className="w-3.5 h-3.5 text-rose-600" />,
          short: 'AUSENTE',
        };
      case 'Pendiente':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
          dot: 'bg-blue-600',
          icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
          short: 'PEND',
        };
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarDays className="w-7 h-7 text-blue-600" />
              <span>Control de Visitas · Planilla Mensual</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Noviembre 2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evolución digital de la planilla de asistencia de CIMA: trazabilidad de llegada, salida y verificación en sitio.
          </p>
        </div>

        {/* View Switcher & Week selector */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Matrix vs Daily Switch */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold border border-slate-200">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'matrix' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Planilla Matriz
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista Día a Día
            </button>
          </div>

          {/* Week Select Tabs */}
          {viewMode === 'matrix' && (
            <div className="flex items-center overflow-x-auto bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {weekRanges.map((w) => (
                <button
                  key={w.week}
                  onClick={() => setSelectedWeek(w.week)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedWeek === w.week
                      ? 'bg-[#0B2545] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend & Operational Warning */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
            Código de Estados:
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verificada (Auditoría en sitio)</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Declarada (Ingreso registrado)</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Programada (Planificada)</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-300 font-semibold">
            <X className="w-3.5 h-3.5 text-rose-600" />
            <span>Ausente (Inasistencia)</span>
          </span>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>El registro de llegada es una declaración; la verificación del supervisor la homologa.</span>
        </div>
      </div>

      {/* VIEW MODE 1: MATRIX SPREADSHEET */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-bold">
                  {/* Left Client Column Header */}
                  <th className="py-3 px-4 w-72 sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    Cliente / Operario Asignado
                  </th>
                  {/* Day Columns */}
                  {daysInRange.map((day) => {
                    const isToday = day === 12;
                    return (
                      <th
                        key={day}
                        className={`py-3 px-2 text-center border-r border-slate-200 transition ${
                          isToday ? 'bg-blue-600 text-white font-extrabold' : ''
                        }`}
                      >
                        <div className="text-[10px]">{getDayName(day)}</div>
                        <div className="text-base">{day}</div>
                        {isToday && (
                          <div className="text-[9px] bg-white text-blue-800 rounded px-1 font-bold mt-0.5">
                            HOY
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {clients.map((client) => {
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition">
                      {/* Sticky Client Info */}
                      <td className="py-3 px-4 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        <div className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer">
                          {client.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{client.assignedStaff.join(', ')}</span>
                        </div>
                      </td>

                      {/* Day Cells */}
                      {daysInRange.map((day) => {
                        const visit = visits.find(
                          (v) => v.clientId === client.id && v.dayNumber === day
                        );
                        const isToday = day === 12;

                        if (!visit) {
                          return (
                            <td
                              key={day}
                              className={`p-1.5 text-center border-r border-slate-100 bg-slate-50/50 ${
                                isToday ? 'bg-blue-50/30' : ''
                              }`}
                            >
                              <span className="text-slate-300 text-[11px]">—</span>
                            </td>
                          );
                        }

                        const badge = getStatusBadge(visit.status);

                        return (
                          <td
                            key={day}
                            onClick={() => {
                              setSelectedVisitId(visit.id);
                              setModalNotes(visit.declaredNotes || '');
                            }}
                            className={`p-1.5 text-center border-r border-slate-100 cursor-pointer transition ${
                              isToday ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div
                              className={`p-1.5 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition shadow-2xs ${badge.bg}`}
                              title={`${client.name} - ${visit.date} (${visit.status})`}
                            >
                              {badge.icon}
                              <span className="text-[9px] font-bold leading-none">{badge.short}</span>
                              {visit.checkInTime && (
                                <span className="text-[8px] text-slate-500 mt-0.5 leading-none">
                                  {visit.checkInTime}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: DAILY CARDS (GREAT FOR MOBILE PHONES) */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          {/* Day Selector Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[8, 9, 10, 11, 12, 13, 14, 15].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDayForDaily(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedDayForDaily === d
                    ? 'bg-[#0B2545] text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>{getDayName(d)}</div>
                <div className="text-sm font-extrabold">{d} Nov</div>
                {d === 12 && (
                  <span className="text-[9px] text-amber-300 block font-semibold">HOY</span>
                )}
              </button>
            ))}
          </div>

          {/* Daily Visits List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visits
              .filter((v) => v.dayNumber === selectedDayForDaily)
              .map((visit) => {
                const badge = getStatusBadge(visit.status);
                const isToday = visit.dayNumber === 12;

                return (
                  <div
                    key={visit.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-base text-slate-900">{visit.clientName}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{visit.shift}</span>
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${badge.bg}`}>
                          {badge.icon}
                          <span>{visit.status}</span>
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 mt-3 pt-3 border-t border-slate-100">
                        <div>
                          Operario asignado: <strong>{visit.employeeName}</strong>
                        </div>
                        <div>
                          Supervisor: <strong>{visit.supervisorName}</strong>
                        </div>
                        {visit.checkInTime && (
                          <div className="text-emerald-700 font-medium">
                            Llegada declarada: {visit.checkInTime} hs
                            {visit.checkOutTime && ` · Salida: ${visit.checkOutTime} hs`}
                          </div>
                        )}
                        {visit.verifiedAt && (
                          <div className="text-blue-700 font-medium">
                            Verificado el {visit.verifiedAt} hs por {visit.verifiedBy}
                          </div>
                        )}
                        {visit.declaredNotes && (
                          <p className="text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg">
                            "{visit.declaredNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedVisitId(visit.id);
                          setModalNotes(visit.declaredNotes || '');
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-bold transition"
                      >
                        Abrir y Gestionar
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* MODAL: DETALLE Y ACCIONES DE VISITA */}
      {activeVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                  Ficha de Visita Operativa
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{activeVisit.clientName}</h2>
                <p className="text-xs text-slate-500">
                  Fecha: {activeVisit.date} · Turno: {activeVisit.shift}
                </p>
              </div>
              <button
                onClick={() => setSelectedVisitId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-4 space-y-4 text-xs">
              {/* Status Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  getStatusBadge(activeVisit.status).bg
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {getStatusBadge(activeVisit.status).icon}
                  <span>Estado Actual: {activeVisit.status}</span>
                </div>
                {activeVisit.dayNumber === 12 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                    Visita de Hoy
                  </span>
                )}
              </div>

              {/* Assignment details */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Operario Responsable
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{activeVisit.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                    Supervisor de Zona
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{activeVisit.supervisorName}</span>
                </div>
              </div>

              {/* Horarios Declarados */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Registro de Asistencia y Tiempos
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Llegada (Check-in):</span>
                  <strong className="text-slate-900">
                    {activeVisit.checkInTime ? `${activeVisit.checkInTime} hs` : 'Sin registrar'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Salida (Check-out):</span>
                  <strong className="text-slate-900">
                    {activeVisit.checkOutTime ? `${activeVisit.checkOutTime} hs` : 'Sin registrar'}
                  </strong>
                </div>
                {activeVisit.verifiedAt && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-emerald-700 font-semibold">
                    <span>Verificado por {activeVisit.verifiedBy}:</span>
                    <span>{activeVisit.verifiedAt} hs</span>
                  </div>
                )}
              </div>

              {/* Observations or declared notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observaciones de la Visita
                </label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Detallar novedades de ingreso o tareas realizadas..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ACTION BUTTONS ACCORDING TO ROLE */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                {/* Empleado Action */}
                {currentRole === 'empleado' && (
                  <div className="flex items-center gap-2">
                    {!activeVisit.checkInTime ? (
                      <button
                        onClick={() => {
                          registerCheckIn(activeVisit.id, modalNotes);
                          setSelectedVisitId(null);
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Registrar Mi Llegada Ahora</span>
                      </button>
                    ) : !activeVisit.checkOutTime ? (
                      <button
                        onClick={() => {
                          registerCheckOut(activeVisit.id, modalNotes);
                          setSelectedVisitId(null);
                        }}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Registrar Mi Salida Ahora</span>
                      </button>
                    ) : (
                      <div className="text-center w-full py-2 text-emerald-700 font-bold bg-emerald-50 rounded-xl">
                        ✓ Asistencia completa registrada para esta visita
                      </div>
                    )}
                  </div>
                )}

                {/* Supervisor & Admin Actions */}
                {(currentRole === 'supervisor' || currentRole === 'admin') && (
                  <div className="space-y-2">
                    {activeVisit.status !== 'Verificada' && (
                      <button
                        onClick={() => {
                          verifyVisit(activeVisit.id, modalNotes);
                          setSelectedVisitId(null);
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>Verificar y Homologar Visita</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          updateVisitStatus(activeVisit.id, 'Ausente', modalNotes);
                          setSelectedVisitId(null);
                        }}
                        className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold border border-rose-200"
                      >
                        Marcar Ausente
                      </button>
                      <button
                        onClick={() => {
                          updateVisitStatus(activeVisit.id, 'Programada', modalNotes);
                          setSelectedVisitId(null);
                        }}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                      >
                        Reset a Programada
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
