import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  PackageOpen,
  FileText,
  Building2,
  Wrench,
  Menu,
  X,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, visits, orders, additionalJobs } = useApp();
  const [showDrawer, setShowDrawer] = useState(false);

  const declaredVisitsCount = visits.filter(
    (v) => v.dayNumber === 12 && v.status === 'Declarada'
  ).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pendiente').length;
  const activeJobsCount = additionalJobs.filter((j) => j.status !== 'Finalizado').length;

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setShowDrawer(false);
  };

  return (
    <>
      {/* Bottom Docked Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-xl px-2 py-1 safe-bottom">
        <div className="flex items-center justify-around">
          {currentRole === 'empleado' && (
            <>
              <button
                onClick={() => handleSelectTab('dashboard')}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition ${
                  activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-6 h-6 mb-1" />
                <span className="text-[11px]">Mi Jornada</span>
              </button>

              <button
                onClick={() => handleSelectTab('visits')}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition ${
                  activeTab === 'visits' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-6 h-6 mb-1" />
                <span className="text-[11px]">Marcar Llegada</span>
              </button>

              <button
                onClick={() => handleSelectTab('orders')}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition ${
                  activeTab === 'orders' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <PackageOpen className="w-6 h-6 mb-1" />
                <span className="text-[11px]">Pedir Insumos</span>
              </button>
            </>
          )}

          {currentRole === 'supervisor' && (
            <>
              <button
                onClick={() => handleSelectTab('dashboard')}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-6 h-6 mb-1" />
                <span className="text-[11px]">Panel</span>
              </button>

              <button
                onClick={() => handleSelectTab('visits')}
                className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'visits' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {declaredVisitsCount > 0 && (
                  <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {declaredVisitsCount}
                  </span>
                )}
                <CalendarDays className="w-6 h-6 mb-1" />
                <span className="text-[11px]">Visitas</span>
              </button>

              <button
                onClick={() => handleSelectTab('supervisions')}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'supervisions' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ClipboardCheck className="w-6 h-6 mb-1 text-emerald-600" />
                <span className="text-[11px] font-semibold text-emerald-700">Supervisar</span>
              </button>

              <button
                onClick={() => handleSelectTab('clients')}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'clients' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-6 h-6 mb-1" />
                <span className="text-[11px]">Clientes</span>
              </button>

              <button
                onClick={() => handleSelectTab('jobs')}
                className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'jobs' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {activeJobsCount > 0 && (
                  <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {activeJobsCount}
                  </span>
                )}
                <Wrench className="w-6 h-6 mb-1" />
                <span className="text-[11px]">Trabajos</span>
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => handleSelectTab('dashboard')}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mb-1" />
                <span className="text-[10px]">Panel</span>
              </button>

              <button
                onClick={() => handleSelectTab('visits')}
                className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'visits' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {declaredVisitsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {declaredVisitsCount}
                  </span>
                )}
                <CalendarDays className="w-5 h-5 mb-1" />
                <span className="text-[10px]">Visitas</span>
              </button>

              <button
                onClick={() => handleSelectTab('orders')}
                className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'orders' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {pendingOrdersCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {pendingOrdersCount}
                  </span>
                )}
                <PackageOpen className="w-5 h-5 mb-1" />
                <span className="text-[10px]">Pedidos</span>
              </button>

              <button
                onClick={() => handleSelectTab('remitos')}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition ${
                  activeTab === 'remitos' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-[10px]">Remitos</span>
              </button>

              <button
                onClick={() => setShowDrawer(true)}
                className="flex flex-col items-center justify-center py-2 px-2 rounded-xl text-slate-500 hover:text-slate-900 transition"
              >
                <Menu className="w-5 h-5 mb-1" />
                <span className="text-[10px]">Más</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Drawer for Extra Items (Admin & General) */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div className="font-bold text-slate-900 text-base">Menú Operativo</div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleSelectTab('clients')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-left text-sm font-semibold text-slate-800"
                >
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Clientes y Servicios</span>
                </button>

                <button
                  onClick={() => handleSelectTab('supervisions')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-left text-sm font-semibold text-slate-800"
                >
                  <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                  <span>Supervisiones en Terreno</span>
                </button>

                <button
                  onClick={() => handleSelectTab('jobs')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-left text-sm font-semibold text-slate-800"
                >
                  <Wrench className="w-5 h-5 text-amber-600" />
                  <span>Trabajos Extra y Tareas</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              <div className="font-bold text-slate-800">CIMA Limpieza Rosario</div>
              <div>Demo comercial para Matías y equipo</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
