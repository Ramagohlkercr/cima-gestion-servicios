import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFILES } from '../data/initialData';
import type { UserRole } from '../types';
import {
  Sparkles,
  Calendar,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  Building2,
  HardHat,
  UserCheck,
  Check,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentRole, switchRole, currentUser, resetToDefaultData } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Building2 className="w-4 h-4 text-amber-500" />;
      case 'supervisor':
        return <HardHat className="w-4 h-4 text-blue-500" />;
      case 'empleado':
        return <UserCheck className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'empleado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0B2545] text-white border-b border-slate-700/60 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-900/40 text-white font-extrabold text-lg tracking-wider border border-white/20">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  CIMA <span className="font-light text-slate-300">|</span> <span className="text-blue-400 font-medium">Gestión de Servicios</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Rosario
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Control Operativo, Visitas y Remitos Digitales</p>
            </div>
          </div>

          {/* Center / Right: Role Switcher & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Date Reference Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Jueves 12 de Noviembre, 2026</span>
            </div>

            {/* Desktop Role Switcher Pills */}
            <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
              {PROFILES.map((profile) => {
                const isActive = currentRole === profile.role;
                return (
                  <button
                    key={profile.role}
                    onClick={() => switchRole(profile.role)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {getRoleIcon(profile.role)}
                    <span>{profile.role.toUpperCase()}</span>
                    {isActive && <Check className="w-3 h-3 text-white ml-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Mobile Role Switcher Button */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
              >
                {getRoleIcon(currentRole)}
                <span className="capitalize">{currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Cambiar Perfil Demo
                  </div>
                  {PROFILES.map((profile) => (
                    <button
                      key={profile.role}
                      onClick={() => {
                        switchRole(profile.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition ${
                        currentRole === profile.role
                          ? 'bg-blue-600/30 text-blue-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {getRoleIcon(profile.role)}
                        <div className="text-left">
                          <div>{profile.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{profile.role}</div>
                        </div>
                      </div>
                      {currentRole === profile.role && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Restaurar datos de prueba originales"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition border border-transparent hover:border-slate-700"
              aria-label="Restaurar datos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subheader bar for Active User context & Demo Notice */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-slate-400">Actuando como:</span>
          <strong className="text-white">{currentUser.name}</strong>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getRoleBadge(currentRole)}`}>
            {currentUser.title}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Almacenamiento Local Reactivo Activo (Sin costo · Datos seguros)</span>
          </span>
        </div>
      </div>

      {/* Modal Confirm Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-900 mb-2">¿Restaurar datos de demostración?</h3>
            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              Esto restablecerá los 8 clientes, las visitas de noviembre 2026, los pedidos de insumos y los remitos a su estado inicial.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow-md shadow-amber-500/20 transition"
              >
                Sí, restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
