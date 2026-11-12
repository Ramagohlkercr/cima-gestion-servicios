import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  CalendarCheck,
  ClipboardCheck,
  PackageOpen,
  Wrench,
  AlertCircle,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Activity,
  PlusCircle,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentRole,
    currentUser,
    setActiveTab,
    clients,
    visits,
    supervisions,
    orders,
    remitos,
    additionalJobs,
    registerCheckIn,
    verifyVisit,
  } = useApp();

  // Metrics for Today (dayNumber === 12)
  const todayVisits = visits.filter((v) => v.dayNumber === 12);
  const todayDeclared = todayVisits.filter((v) => v.status === 'Declarada').length;
  const todayVerified = todayVisits.filter((v) => v.status === 'Verificada').length;
  const todayPending = todayVisits.filter((v) => v.status === 'Programada').length;

  const pendingOrders = orders.filter((o) => o.status === 'Pendiente');
  const activeJobs = additionalJobs.filter((j) => j.status !== 'Finalizado');

  // Employee specific view items
  const employeeAssignedVisits = todayVisits.filter(
    (v) => v.clientId === 'cli-1' || v.clientId === 'cli-2'
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Welcome & Context Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6E] rounded-2xl p-6 text-white shadow-md border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
            <Activity className="w-3.5 h-3.5" />
            <span>Operaciones en Vivo · Rosario, Santa Fe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hola, {currentUser.name}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            {currentRole === 'admin' &&
              'Panel ejecutivo de control integral. Supervisá asistencia de cuadrillas, pedidos de insumos y emisión de remitos.'}
            {currentRole === 'supervisor' &&
              'Control de terreno activo. Verificá visitas declaradas por el personal y completá auditorías con checklist.'}
            {currentRole === 'empleado' &&
              'Consultá tus servicios asignados de hoy, registrá tu horario de ingreso/salida y solicitá insumos al instante.'}
          </p>
        </div>

        {/* Quick Action Button depending on role */}
        <div className="flex flex-wrap items-center gap-3">
          {currentRole === 'empleado' && (
            <button
              onClick={() => setActiveTab('orders')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 transition"
            >
              <PackageOpen className="w-4 h-4" />
              <span>Solicitar Insumos</span>
            </button>
          )}

          {currentRole === 'supervisor' && (
            <button
              onClick={() => setActiveTab('supervisions')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 transition"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Nueva Supervisión</span>
            </button>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => setActiveTab('visits')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 transition"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Ver Planilla de Visitas</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Clientes */}
        <div
          onClick={() => (currentRole !== 'empleado' ? setActiveTab('clients') : null)}
          className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition hover:shadow-md ${
            currentRole !== 'empleado' ? 'cursor-pointer' : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Clientes Activos</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{clients.length}</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">100% operativos</span> en Rosario
          </p>
        </div>

        {/* Card 2: Visitas Hoy */}
        <div
          onClick={() => setActiveTab('visits')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Visitas Hoy (Jue 12)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{todayVisits.length}</span>
            <span className="text-xs text-slate-500">servicios</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs font-medium">
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {todayVerified} verif.
            </span>
            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              {todayDeclared} declar.
            </span>
            <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              {todayPending} prog.
            </span>
          </div>
        </div>

        {/* Card 3: Pedidos de Insumos */}
        <div
          onClick={() => (currentRole !== 'supervisor' ? setActiveTab('orders') : null)}
          className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition hover:shadow-md ${
            currentRole !== 'supervisor' ? 'cursor-pointer' : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pedidos Insumos</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PackageOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{orders.length}</span>
            {pendingOrders.length > 0 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {pendingOrders.length} pendientes
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {remitos.length} remitos digitales emitidos
          </p>
        </div>

        {/* Card 4: Trabajos Extra */}
        <div
          onClick={() => (currentRole !== 'empleado' ? setActiveTab('jobs') : null)}
          className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition hover:shadow-md ${
            currentRole !== 'empleado' ? 'cursor-pointer' : ''
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Trabajos Extra</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{activeJobs.length}</div>
          <p className="text-xs text-slate-500 mt-1">
            {supervisions.length} supervisiones presenciales registradas
          </p>
        </div>
      </div>

      {/* EMPLEADO SPECIFIC DASHBOARD WIDGET */}
      {currentRole === 'empleado' && (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/30 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <h2 className="text-lg font-bold text-slate-900">Tus Servicios de Hoy (Jueves 12 Nov)</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              Operaria: Mariela Gómez
            </span>
          </div>

          <div className="space-y-4">
            {employeeAssignedVisits.map((visit) => {
              const isDeclared = visit.status === 'Declarada' || visit.status === 'Verificada';
              return (
                <div
                  key={visit.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{visit.clientName}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          visit.status === 'Verificada'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : visit.status === 'Declarada'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{visit.shift}</span>
                    </p>
                    {visit.checkInTime && (
                      <p className="text-xs text-emerald-700 mt-1 font-medium">
                        ✓ Llegada registrada a las {visit.checkInTime} hs
                        {visit.checkOutTime && ` · Salida a las ${visit.checkOutTime} hs`}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {!isDeclared ? (
                      <button
                        onClick={() => registerCheckIn(visit.id)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Registrar Llegada</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {!visit.checkOutTime && (
                          <button
                            onClick={() => {
                              setActiveTab('visits');
                            }}
                            className="w-full sm:w-auto px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
                          >
                            Registrar Salida
                          </button>
                        )}
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                        >
                          <PackageOpen className="w-3.5 h-3.5" />
                          <span>Pedir Insumos</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Operational Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operational Alerts & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Important Operational Alerts */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>Alertas y Tareas Operativas Prioritarias</span>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-md">
                Requieren Acción
              </span>
            </div>

            <div className="space-y-3">
              {/* Alert 1: Pending Order */}
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <PackageOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{order.clientName}</span>
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          Pedido Insumos Pendiente
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Solicitado por {order.requestedBy} ({order.items.length} ítems):{' '}
                        {order.items.map((i) => `${i.quantity} ${i.unit} de ${i.name.split('(')[0]}`).join(', ')}
                      </p>
                    </div>
                  </div>

                  {currentRole === 'admin' ? (
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shrink-0 transition"
                    >
                      Preparar y Remitir
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">En espera de administración</span>
                  )}
                </div>
              ))}

              {/* Alert 2: Declared Visits needing verification */}
              {todayVisits
                .filter((v) => v.status === 'Declarada')
                .map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{v.clientName}</span>
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Visita Declarada (Check-in {v.checkInTime || '08:00'})
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Operario/a: {v.employeeName} · {v.declaredNotes || 'Llegada registrada en sitio.'}
                        </p>
                      </div>
                    </div>

                    {currentRole === 'supervisor' || currentRole === 'admin' ? (
                      <button
                        onClick={() => verifyVisit(v.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0 transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verificar Visita</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">Pendiente de supervisor</span>
                    )}
                  </div>
                ))}

              {/* Alert 3: High Priority Jobs */}
              {additionalJobs
                .filter((j) => j.priority === 'alta' && j.status !== 'Finalizado')
                .map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{job.title}</span>
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            {job.clientName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{job.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shrink-0 transition"
                    >
                      Ver Trabajo Extra
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Flow Guide for Client Test */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
            <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <span>Flujo de Demostración Comercial Recomendado</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Para comprobar la coherencia total de la aplicación en 3 minutos:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="text-amber-400 font-bold mb-1">1. Modo Empleado</div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Cambiá al perfil <strong>Mariela</strong>. Registrá la llegada en Centro Médico Del Sol y creá un pedido de lavandina y guantes.
                </p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="text-blue-400 font-bold mb-1">2. Modo Administrador</div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Volvé a <strong>Matías</strong>. Consultá el pedido en Pedidos, tocalo y generá el <strong>Remito Digital</strong> imprimible.
                </p>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <div className="text-emerald-400 font-bold mb-1">3. Modo Supervisor</div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Pasá a <strong>Carlos</strong>. Auditá la visita con el checklist Bien/Regular/Mal y detectá un trabajo de limpieza especial.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activities & Fast Links */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-4">Accesos Directos</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('visits')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                  <span>Matriz Mensual de Visitas</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('supervisions')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                  <span>Formulario de Supervisión</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-left transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <PackageOpen className="w-4 h-4 text-amber-600" />
                  <span>Gestión de Insumos</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('remitos')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 text-left transition text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Remitos X Digitales</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Recent Audits / Supervisions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
              <span>Supervisiones Recientes</span>
              <span className="text-[11px] font-normal text-slate-500">Historial</span>
            </h3>

            <div className="space-y-3">
              {supervisions.slice(0, 3).map((sup) => (
                <div key={sup.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900">{sup.clientName}</strong>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Puntaje {sup.overallScore}/10
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mb-1">
                    Supervisor: {sup.supervisorName} · {sup.date} {sup.time} hs
                  </div>
                  <p className="text-slate-700 italic text-[11px] leading-snug line-clamp-2">
                    "{sup.observations}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
