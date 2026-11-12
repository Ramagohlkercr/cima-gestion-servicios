import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  UserProfile,
  Client,
  Visit,
  VisitStatus,
  Supervision,
  SupplyOrder,
  OrderStatus,
  Remito,
  AdditionalJob,
  JobStatus,
} from '../types';
import {
  PROFILES,
  INITIAL_CLIENTS,
  generateInitialVisits,
  INITIAL_SUPERVISIONS,
  INITIAL_SUPPLY_ORDERS,
  INITIAL_REMITOS,
  INITIAL_ADDITIONAL_JOBS,
} from '../data/initialData';

interface NotificationState {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentRole: UserRole;
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notification: NotificationState | null;
  showNotification: (message: string, type?: NotificationState['type']) => void;
  clearNotification: () => void;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  // Visits
  visits: Visit[];
  updateVisitStatus: (visitId: string, status: VisitStatus, notes?: string) => void;
  registerCheckIn: (visitId: string, notes?: string) => void;
  registerCheckOut: (visitId: string, notes?: string) => void;
  verifyVisit: (visitId: string, supervisorNotes?: string) => void;
  selectedVisitId: string | null;
  setSelectedVisitId: (id: string | null) => void;

  // Supervisions
  supervisions: Supervision[];
  addSupervision: (supervision: Omit<Supervision, 'id' | 'createdAt'>, createJob?: boolean) => void;

  // Supply Orders
  orders: SupplyOrder[];
  createSupplyOrder: (order: Omit<SupplyOrder, 'id' | 'orderNumber' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Remitos
  remitos: Remito[];
  generateRemitoFromOrder: (orderId: string, receivedBy?: string) => Remito;
  updateRemitoStatus: (remitoId: string, status: Remito['status'], signature?: string, receivedBy?: string) => void;
  selectedRemitoId: string | null;
  setSelectedRemitoId: (id: string | null) => void;

  // Additional Jobs
  additionalJobs: AdditionalJob[];
  addAdditionalJob: (job: Omit<AdditionalJob, 'id' | 'createdAt'>) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;

  // Reset
  resetToDefaultData: () => void;
}

const STORAGE_KEY = 'CIMA_GESTION_SERVICIOS_STATE_V1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or use initial defaults
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved state from localStorage', e);
    }
    return null;
  };

  const initialState = loadSavedState();

  const [currentRole, setCurrentRole] = useState<UserRole>(initialState?.currentRole || 'admin');
  const [activeTab, setActiveTab] = useState<string>(initialState?.activeTab || 'dashboard');
  const [clients, setClients] = useState<Client[]>(initialState?.clients || INITIAL_CLIENTS);
  const [visits, setVisits] = useState<Visit[]>(initialState?.visits || generateInitialVisits());
  const [supervisions, setSupervisions] = useState<Supervision[]>(initialState?.supervisions || INITIAL_SUPERVISIONS);
  const [orders, setOrders] = useState<SupplyOrder[]>(initialState?.orders || INITIAL_SUPPLY_ORDERS);
  const [remitos, setRemitos] = useState<Remito[]>(initialState?.remitos || INITIAL_REMITOS);
  const [additionalJobs, setAdditionalJobs] = useState<AdditionalJob[]>(initialState?.additionalJobs || INITIAL_ADDITIONAL_JOBS);

  // UI state
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [selectedRemitoId, setSelectedRemitoId] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const currentUser = PROFILES.find((p) => p.role === currentRole) || PROFILES[0];

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      const stateToSave = {
        currentRole,
        activeTab,
        clients,
        visits,
        supervisions,
        orders,
        remitos,
        additionalJobs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
  }, [currentRole, activeTab, clients, visits, supervisions, orders, remitos, additionalJobs]);

  const showNotification = (message: string, type: NotificationState['type'] = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const clearNotification = () => setNotification(null);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const profile = PROFILES.find((p) => p.role === role);
    showNotification(`Perfil cambiado a ${profile?.name} (${profile?.title})`, 'info');
  };

  // CLIENTS
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newId = `cli-${Date.now()}`;
    const newClient: Client = {
      ...clientData,
      id: newId,
      createdAt: '2026-11-12',
    };
    setClients((prev) => [newClient, ...prev]);

    // Also add scheduled visits for today and the rest of month
    const newVisits: Visit[] = [];
    for (let day = 12; day <= 30; day++) {
      newVisits.push({
        id: `vis-${newId}-${day}`,
        clientId: newId,
        clientName: newClient.name,
        date: `2026-11-${day.toString().padStart(2, '0')}`,
        dayNumber: day,
        employeeId: 'usr-empleado',
        employeeName: newClient.assignedStaff[0] || 'Mariela Gómez',
        supervisorName: newClient.assignedSupervisor || 'Carlos Benítez',
        shift: newClient.frequency,
        status: 'Programada',
      });
    }
    setVisits((prev) => [...prev, ...newVisits]);
    showNotification(`Cliente "${newClient.name}" registrado con éxito.`, 'success');
  };

  // VISITS
  const updateVisitStatus = (visitId: string, status: VisitStatus, notes?: string) => {
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === visitId) {
          return {
            ...v,
            status,
            declaredNotes: notes || v.declaredNotes,
          };
        }
        return v;
      })
    );
    showNotification(`Estado de visita actualizado a: ${status}`, 'info');
  };

  const registerCheckIn = (visitId: string, notes?: string) => {
    const nowTime = '08:00'; // Target time on demo day
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === visitId) {
          return {
            ...v,
            status: 'Declarada',
            checkInTime: nowTime,
            declaredNotes: notes || (v.declaredNotes ? `${v.declaredNotes} · Ingreso registrado` : 'Llegada registrada por operario.'),
          };
        }
        return v;
      })
    );
    showNotification(`✓ Llegada registrada exitosamente (${nowTime} hs)`, 'success');
  };

  const registerCheckOut = (visitId: string, notes?: string) => {
    const outTime = '12:30';
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === visitId) {
          return {
            ...v,
            checkOutTime: outTime,
            declaredNotes: notes
              ? `${v.declaredNotes ? v.declaredNotes + ' | ' : ''}Salida: ${notes}`
              : v.declaredNotes,
          };
        }
        return v;
      })
    );
    showNotification(`✓ Salida registrada (${outTime} hs). Visita declarada lista para verificación.`, 'success');
  };

  const verifyVisit = (visitId: string, supervisorNotes?: string) => {
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === visitId) {
          return {
            ...v,
            status: 'Verificada',
            verifiedAt: '2026-11-12 11:30',
            verifiedBy: currentUser.name,
            supervisorNotes: supervisorNotes || 'Supervisión en sitio conforme con el pliego de servicio.',
          };
        }
        return v;
      })
    );
    showNotification(`✓ Visita verificada por ${currentUser.name}`, 'success');
  };

  // SUPERVISIONS
  const addSupervision = (supervisionData: Omit<Supervision, 'id' | 'createdAt'>, createJob: boolean = false) => {
    const newId = `sup-${Date.now()}`;
    const newSupervision: Supervision = {
      ...supervisionData,
      id: newId,
      createdAt: '2026-11-12 11:45:00',
    };

    // If a detected task exists and was checked, create an additional job automatically
    if (createJob && supervisionData.detectedTask && supervisionData.detectedTask.title.trim() !== '') {
      const newJobId = `job-${Date.now()}`;
      newSupervision.detectedTask = {
        ...supervisionData.detectedTask,
        createdJobId: newJobId,
      };

      const newJob: AdditionalJob = {
        id: newJobId,
        clientId: supervisionData.clientId,
        clientName: supervisionData.clientName,
        title: supervisionData.detectedTask.title,
        description: supervisionData.detectedTask.description || 'Tarea detectada en supervisión presencial.',
        priority: supervisionData.detectedTask.priority,
        status: 'Pendiente',
        assignedStaff: 'A designar por Administración',
        source: `Supervisión en ${supervisionData.clientName}`,
        targetDate: '2026-11-14',
        createdAt: '2026-11-12 11:45:00',
      };
      setAdditionalJobs((prev) => [newJob, ...prev]);
      showNotification(`Supervisión guardada y Trabajo Adicional "${newJob.title}" creado automáticamente.`, 'success');
    } else {
      showNotification(`Supervisión en "${supervisionData.clientName}" registrada con éxito.`, 'success');
    }

    setSupervisions((prev) => [newSupervision, ...prev]);
  };

  // SUPPLY ORDERS
  const createSupplyOrder = (orderData: Omit<SupplyOrder, 'id' | 'orderNumber' | 'updatedAt'>) => {
    const nextNum = 90 + orders.length;
    const newOrder: SupplyOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `PED-2026-0${nextNum}`,
      updatedAt: '2026-11-12 11:50:00',
    };
    setOrders((prev) => [newOrder, ...prev]);
    showNotification(`Pedido ${newOrder.orderNumber} enviado a Administración.`, 'success');
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            updatedAt: '2026-11-12 11:55:00',
          };
        }
        return o;
      })
    );
    showNotification(`Pedido actualizado a estado: "${newStatus}"`, 'info');
  };

  // REMITOS
  const generateRemitoFromOrder = (orderId: string, receivedBy?: string): Remito => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const client = clients.find((c) => c.id === order.clientId);
    const nextRemitoNum = 141 + remitos.length;
    const remitoNumber = `R-0001-00000${nextRemitoNum}`;

    const newRemito: Remito = {
      id: `rem-${Date.now()}`,
      remitoNumber,
      orderId: order.id,
      clientId: order.clientId,
      clientName: order.clientName,
      clientAddress: client?.address ? `${client.address}, ${client.city}` : 'Rosario, Santa Fe',
      clientCuit: client?.cuit || '30-71000000-0',
      deliveryDate: '2026-11-12',
      deliveredBy: currentUser.name,
      receivedBy: receivedBy || client?.contactName || 'Personal Autorizado',
      items: order.items,
      status: 'Entregado',
      signatureData: `Recepción Conforme: ${receivedBy || client?.contactName || 'Responsable'}`,
      notes: `Generado desde pedido ${order.orderNumber}. Entrega conforme de insumos de limpieza.`,
      isFiscal: false,
      createdAt: '2026-11-12 12:00:00',
    };

    setRemitos((prev) => [newRemito, ...prev]);

    // Update order status to Entregado and link remito
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Entregado',
            remitoId: newRemito.id,
            updatedAt: '2026-11-12 12:00:00',
          };
        }
        return o;
      })
    );

    showNotification(`Remito Digital ${remitoNumber} generado y confirmado.`, 'success');
    return newRemito;
  };

  const updateRemitoStatus = (
    remitoId: string,
    status: Remito['status'],
    signature?: string,
    receivedBy?: string
  ) => {
    setRemitos((prev) =>
      prev.map((r) => {
        if (r.id === remitoId) {
          return {
            ...r,
            status,
            signatureData: signature || r.signatureData,
            receivedBy: receivedBy || r.receivedBy,
          };
        }
        return r;
      })
    );
    showNotification(`Remito actualizado a estado: "${status}"`, 'info');
  };

  // ADDITIONAL JOBS
  const addAdditionalJob = (jobData: Omit<AdditionalJob, 'id' | 'createdAt'>) => {
    const newJob: AdditionalJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: '2026-11-12 12:10:00',
    };
    setAdditionalJobs((prev) => [newJob, ...prev]);
    showNotification(`Trabajo Adicional "${newJob.title}" registrado.`, 'success');
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setAdditionalJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status,
            completedAt: status === 'Finalizado' ? '2026-11-12 12:15:00' : undefined,
          };
        }
        return j;
      })
    );
    showNotification(`Trabajo Adicional actualizado a: "${status}"`, 'info');
  };

  // RESET
  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentRole('admin');
    setActiveTab('dashboard');
    setClients(INITIAL_CLIENTS);
    setVisits(generateInitialVisits());
    setSupervisions(INITIAL_SUPERVISIONS);
    setOrders(INITIAL_SUPPLY_ORDERS);
    setRemitos(INITIAL_REMITOS);
    setAdditionalJobs(INITIAL_ADDITIONAL_JOBS);
    setSelectedClientId(null);
    setSelectedVisitId(null);
    setSelectedRemitoId(null);
    showNotification('Datos de demostración restaurados a sus valores originales.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        switchRole,
        activeTab,
        setActiveTab,
        notification,
        showNotification,
        clearNotification,
        clients,
        addClient,
        selectedClientId,
        setSelectedClientId,
        visits,
        updateVisitStatus,
        registerCheckIn,
        registerCheckOut,
        verifyVisit,
        selectedVisitId,
        setSelectedVisitId,
        supervisions,
        addSupervision,
        orders,
        createSupplyOrder,
        updateOrderStatus,
        remitos,
        generateRemitoFromOrder,
        updateRemitoStatus,
        selectedRemitoId,
        setSelectedRemitoId,
        additionalJobs,
        addAdditionalJob,
        updateJobStatus,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
