import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATALOG_SUPPLIES } from '../data/initialData';
import type { OrderItem, OrderStatus } from '../types';
import {
  PackageOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  User,
  Calendar,
  AlertCircle,
  Building2,
  X,
  ChevronRight,
} from 'lucide-react';

export const SupplyOrdersView: React.FC = () => {
  const {
    currentRole,
    currentUser,
    orders,
    clients,
    createSupplyOrder,
    updateOrderStatus,
    generateRemitoFromOrder,
    setSelectedRemitoId,
    setActiveTab,
  } = useApp();

  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // New Order Form state
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: 'item-1', name: CATALOG_SUPPLIES[0].name, quantity: 4, unit: CATALOG_SUPPLIES[0].unit },
    { id: 'item-2', name: CATALOG_SUPPLIES[3].name, quantity: 2, unit: CATALOG_SUPPLIES[3].unit },
  ]);
  const [orderNotes, setOrderNotes] = useState('');

  const handleAddItemRow = () => {
    const defaultCatalogItem = CATALOG_SUPPLIES[0];
    setOrderItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${prev.length}`,
        name: defaultCatalogItem.name,
        quantity: 1,
        unit: defaultCatalogItem.unit,
      },
    ]);
  };

  const handleRemoveItemRow = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemSelectChange = (id: string, itemName: string) => {
    const found = CATALOG_SUPPLIES.find((c) => c.name === itemName);
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            name: itemName,
            unit: found?.unit || 'unidades',
          };
        }
        return item;
      })
    );
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, qty) };
        }
        return item;
      })
    );
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId);
    if (!client || orderItems.length === 0) return;

    createSupplyOrder({
      clientId: client.id,
      clientName: client.name,
      requestedBy: currentUser.name,
      date: '2026-11-12',
      items: orderItems,
      observations: orderNotes.trim() || undefined,
      status: 'Pendiente',
    });

    setShowNewOrderModal(false);
    setOrderNotes('');
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pendiente':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <Clock className="w-3.5 h-3.5 text-rose-600" />,
        };
      case 'En preparación':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <PackageOpen className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'Preparado':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <Truck className="w-3.5 h-3.5 text-blue-600" />,
        };
      case 'Entregado':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <PackageOpen className="w-7 h-7 text-amber-600" />
              <span>Pedidos de Insumos ({orders.length})</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Control de Stock
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reemplazo del pedido en papel: solicitud ágil por operario, preparación en depósito y generación directa de Remitos.
          </p>
        </div>

        <button
          onClick={() => setShowNewOrderModal(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-2 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Insumos</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const badge = getOrderStatusBadge(order.status);
          const isPending = order.status === 'Pendiente';
          const isDelivered = order.status === 'Entregado';

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm border border-amber-200">
                    {order.orderNumber.split('-')[2] || 'PED'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{order.clientName}</h3>
                      <span className="text-xs text-slate-500 font-semibold">({order.orderNumber})</span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Solicitado por: <strong>{order.requestedBy}</strong></span>
                      <span>·</span>
                      <span>Fecha: {order.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                    {badge.icon}
                    <span>{order.status}</span>
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="py-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Detalle de Insumos Solicitados:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800 line-clamp-1">{item.name}</span>
                      <span className="px-2 py-0.5 rounded bg-white text-slate-900 font-bold border border-slate-200 shrink-0 ml-2">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>

                {order.observations && (
                  <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200 mt-3 italic">
                    <strong>Nota del operario:</strong> "{order.observations}"
                  </p>
                )}
              </div>

              {/* Footer Actions (Specifically for Admin or Delivery) */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  {order.remitoId ? (
                    <button
                      onClick={() => {
                        setSelectedRemitoId(order.remitoId!);
                        setActiveTab('remitos');
                      }}
                      className="text-blue-600 font-bold flex items-center gap-1 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Remito Vinculado: #{order.remitoId} (Ver)</span>
                    </button>
                  ) : (
                    <span>Sin remito emitido aún</span>
                  )}
                </div>

                {/* State Transition buttons for Admin */}
                {currentRole === 'admin' && (
                  <div className="flex items-center gap-2">
                    {order.status === 'Pendiente' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'En preparación')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition"
                      >
                        Pasar a En Preparación
                      </button>
                    )}

                    {order.status === 'En preparación' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparado')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                      >
                        Marcar Preparado
                      </button>
                    )}

                    {!order.remitoId && (
                      <button
                        onClick={() => {
                          const rem = generateRemitoFromOrder(order.id);
                          setSelectedRemitoId(rem.id);
                          setActiveTab('remitos');
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Generar Remito Digital</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: NUEVO PEDIDO DE INSUMOS */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                  Requerimiento de Materiales
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Nuevo Pedido de Insumos de Limpieza
                </h2>
              </div>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cliente / Servicio Destino *</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.address})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-bold text-slate-700">Artículos e Insumos a Solicitar *</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Ítem</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <select
                        value={item.name}
                        onChange={(e) => handleItemSelectChange(item.id, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 text-slate-800 font-medium"
                      >
                        {CATALOG_SUPPLIES.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1 w-24">
                        <input
                          type="number"
                          min="1"
                          max="999"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="w-14 px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-center font-bold"
                        />
                        <span className="text-[10px] text-slate-500 font-medium">{item.unit}</span>
                      </div>

                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                          title="Eliminar fila"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observaciones / Urgencia de Entrega
                </label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ej. Queda poco detergente en depósito del subsuelo..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20 text-xs transition"
                >
                  Enviar Pedido a Administración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
