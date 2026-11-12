import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  ClipboardCheck,
  PackageOpen,
  FileText,
  Wrench,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, clients, visits, orders, additionalJobs } = useApp();

  // Badges
  const declaredVisitsCount = visits.filter(
    (v) => v.dayNumber === 12 && v.status === 'Declarada'
  ).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pendiente').length;
  const activeJobsCount = additionalJobs.filter((j) => j.status !== 'Finalizado').length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
    roles: ('admin' | 'supervisor' | 'empleado')[];
    description: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: currentRole === 'empleado' ? 'Mi Jornada' : 'Panel de Control',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'supervisor', 'empleado'],
      description: 'Métricas, alertas y estado general',
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: <Building2 className="w-5 h-5" />,
      badge: clients.length,
      roles: ['admin', 'supervisor'],
      description: 'Fichas, frecuencias y cuadrillas',
    },
    {
      id: 'visits',
      label: currentRole === 'empleado' ? 'Marcar Visita' : 'Control de Visitas',
      icon: <CalendarDays className="w-5 h-5" />,
      badge: declaredVisitsCount > 0 ? declaredVisitsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
      roles: ['admin', 'supervisor', 'empleado'],
      description: 'Planilla mensual digitalizada',
    },
    {
      id: 'supervisions',
      label: 'Supervisiones',
      icon: <ClipboardCheck className="w-5 h-5" />,
      roles: ['admin', 'supervisor'],
      description: 'Auditorías con checklist en móvil',
    },
    {
      id: 'orders',
      label: currentRole === 'empleado' ? 'Solicitar Insumos' : 'Pedidos de Insumos',
      icon: <PackageOpen className="w-5 h-5" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      roles: ['admin', 'empleado'],
      description: 'Reposición y solicitudes de stock',
    },
    {
      id: 'remitos',
      label: 'Remitos Digitales',
      icon: <FileText className="w-5 h-5" />,
      roles: ['admin'],
      description: 'Remitos X y constancias de entrega',
    },
    {
      id: 'jobs',
      label: 'Trabajos Extra',
      icon: <Wrench className="w-5 h-5" />,
      badge: activeJobsCount > 0 ? activeJobsCount : undefined,
      badgeColor: 'bg-blue-500 text-white',
      roles: ['admin', 'supervisor'],
      description: 'Tareas adicionales y correctivas',
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0B2545] border-r border-slate-700/80 text-white shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Módulos Operativos
        </div>

        {visibleItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 group text-left ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}>
                  {item.icon}
                </span>
                <div>
                  <div className="leading-tight">{item.label}</div>
                  <div className="text-[11px] font-normal text-slate-400 group-hover:text-slate-300">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
        <div className="flex items-center gap-2 mb-1.5 text-slate-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CIMA Limpieza</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Solución desarrollada por Fluent Code Soluciones para gestión integral de servicios en Rosario.
        </p>
      </div>
    </aside>
  );
};
