import type { UserProfile, Client, Visit, Supervision, SupplyOrder, Remito, AdditionalJob } from '../types';

export const PROFILES: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'Matías Cima',
    role: 'admin',
    title: 'Gerente General & Operaciones',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 'usr-supervisor',
    name: 'Carlos Benítez',
    role: 'supervisor',
    title: 'Supervisor de Servicios Zona Centro/Norte',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    assignedClients: ['cli-1', 'cli-2', 'cli-4', 'cli-5', 'cli-7'],
  },
  {
    id: 'usr-empleado',
    name: 'Mariela Gómez',
    role: 'empleado',
    title: 'Operaria de Limpieza Integral',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    assignedClients: ['cli-1', 'cli-2'],
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Centro Médico Del Sol',
    legalName: 'Salud del Sol S.R.L.',
    cuit: '30-71448291-8',
    address: 'Bv. Oroño 1420',
    city: 'Rosario, Santa Fe',
    contactName: 'Dra. Marcela Ramos (Directora Médica)',
    contactPhone: '0341-449-8800 (Int. 204)',
    frequency: 'Lunes a Sábado · Turnos Mañana y Tarde',
    cleaningPlan: 'Protocolo Sanitario Hospitalario Nivel II (Quirófanos, Guardia y Espera)',
    assignedStaff: ['Mariela Gómez', 'Roberto Díaz'],
    assignedSupervisor: 'Carlos Benítez',
    areas: ['Guardia Médica', 'Quirófano 1 y 2', 'Consultorios PB', 'Salas de Espera', 'Sanitarios Públicos'],
    status: 'active',
    notes: 'Priorizar reposición de alcohol en gel y jabón antibacterial.',
    createdAt: '2026-01-15',
  },
  {
    id: 'cli-2',
    name: 'Colegio San Rafael',
    legalName: 'Asociación Civil San Rafael',
    cuit: '30-58291044-3',
    address: 'Mendoza 2350',
    city: 'Rosario, Santa Fe',
    contactName: 'Lic. Esteban Rossi (Director)',
    contactPhone: '0341-421-5520',
    frequency: 'Lunes a Viernes · 14:00 a 20:00 hs',
    cleaningPlan: 'Mantenimiento Educativo Integral de Aulas y Patios',
    assignedStaff: ['Mariela Gómez', 'Roberto Díaz'],
    assignedSupervisor: 'Carlos Benítez',
    areas: ['Aulas Primaria (10)', 'Aulas Secundaria (8)', 'Patios y Gimnasio', 'Baterías de Sanitarios (3)'],
    status: 'active',
    notes: 'Limpieza de sanitarios cada 90 minutos durante recreos.',
    createdAt: '2026-02-10',
  },
  {
    id: 'cli-3',
    name: 'Estudio Contable Ferraro',
    legalName: 'Ferraro & Asociados Consultores S.A.',
    cuit: '30-69882190-2',
    address: 'Córdoba 1345, Piso 7',
    city: 'Rosario, Santa Fe',
    contactName: 'Cdor. Germán Ferraro',
    contactPhone: '0341-424-9911',
    frequency: 'Martes y Jueves · 08:00 a 12:00 hs',
    cleaningPlan: 'Limpieza Corporativa de Oficinas y Archivo Seguro',
    assignedStaff: ['Lucía Peralta'],
    assignedSupervisor: 'Carlos Benítez',
    areas: ['Recepción', 'Sala de Directorio', '6 Despachos', 'Office y Cocina'],
    status: 'active',
    notes: 'Cuidado especial con equipos de cómputo y documentación contable.',
    createdAt: '2026-03-01',
  },
  {
    id: 'cli-4',
    name: 'Supermercado Los Álamos',
    legalName: 'Distribuidora Los Álamos S.A.',
    cuit: '30-64219003-7',
    address: 'Av. Pellegrini 3820',
    city: 'Rosario, Santa Fe',
    contactName: 'Sergio Menéndez (Gerente de Sucursal)',
    contactPhone: '0341-438-7744',
    frequency: 'Lunes a Domingo · Nocturno y Apertura',
    cleaningPlan: 'Tratamiento de Pisos de Alto Tránsito y Cámaras de Frío',
    assignedStaff: ['Juan Pablo Roldán', 'Roberto Díaz'],
    assignedSupervisor: 'Carlos Benítez',
    areas: ['Salón de Ventas', 'Línea de Cajas', 'Depósito y Recepción', 'Cámaras Frigoríficas'],
    status: 'active',
    notes: 'Uso obligatorio de barredora automática en salón.',
    createdAt: '2026-03-15',
  },
  {
    id: 'cli-5',
    name: 'Edificio Torre Alvear',
    legalName: 'Consorcio Propietarios Torre Alvear',
    cuit: '33-70891234-9',
    address: 'Alvear 740',
    city: 'Rosario, Santa Fe',
    contactName: 'Elena Martínez (Administración Del Parque)',
    contactPhone: '0341-440-1290',
    frequency: 'Lunes a Sábado · 07:00 a 11:00 hs',
    cleaningPlan: 'Mantenimiento de Consorcios de Alta Gama',
    assignedStaff: ['Elena Martínez'],
    assignedSupervisor: 'Carlos Benítez',
    areas: ['Hall de Entrada en Doble Altura', 'Palieres (Pisos 1 al 14)', 'SUM y Gimnasio', 'Cocheras'],
    status: 'active',
    notes: 'Lustrado de bronce y vidrios de hall tres veces por semana.',
    createdAt: '2026-04-05',
  },
  {
    id: 'cli-6',
    name: 'Clínica Veterinaria Patitas',
    legalName: 'Centro Veterinario Patitas S.R.L.',
    cuit: '30-71829031-1',
    address: 'Rioja 1890',
    city: 'Rosario, Santa Fe',
    contactName: 'Vet. Sabrina Méndez',
    contactPhone: '0341-425-6633',
    frequency: 'Lunes a Viernes · 13:00 a 17:00 hs',
    cleaningPlan: 'Desinfección Enzimática y Control de Olores Clínicos',
    assignedStaff: ['Roberto Díaz'],
    assignedSupervisor: 'Carlos Benítez',
    areas: ['Recepción y Pet Shop', 'Consultorios 1 y 2', 'Quirófano', 'Área de Internación Canina/Felina'],
    status: 'active',
    notes: 'Usar únicamente desinfectante neutro con amonio cuaternario.',
    createdAt: '2026-05-12',
  },
  {
    id: 'cli-7',
    name: 'Gimnasio Fortaleza',
    legalName: 'Fortaleza Fitness Club',
    cuit: '20-33418290-4',
    address: 'Av. Francia 950',
    city: 'Rosario, Santa Fe',
    contactName: 'Marcos Valenti',
    contactPhone: '0341-439-0012',
    frequency: 'Lunes a Viernes · Doble Turno (06:00 y 14:00 hs)',
    cleaningPlan: 'Sanitización Continua de Vestuarios y Máquinas',
    assignedStaff: ['Juan Pablo Roldán'],
    assignedSupervisor: 'Carlos Benítez',
    areas: ['Sala de Musculación', 'Vestuarios y Duchas Caballeros', 'Vestuarios Damas', 'Salón Funcional'],
    status: 'active',
    notes: 'Doble repaso de vestuarios en hora pico (18:00 a 20:00 hs).',
    createdAt: '2026-06-01',
  },
  {
    id: 'cli-8',
    name: 'Logística Rivadavia S.A.',
    legalName: 'Logística Rivadavia S.A.',
    cuit: '30-65991823-5',
    address: 'Circunvalación y Rivadavia Km 3',
    city: 'Rosario, Santa Fe',
    contactName: 'Ing. Pablo Carrizo',
    contactPhone: '0341-456-3300',
    frequency: 'Lunes a Sábado · 07:00 a 15:00 hs',
    cleaningPlan: 'Limpieza Industrial Pesada en Naves y Oficinas Logísticas',
    assignedStaff: ['Lucía Peralta', 'Roberto Díaz'],
    assignedSupervisor: 'Carlos Benítez',
    areas: ['Nave Central 3.000m²', 'Comedor de Choferes', 'Batería Sanitarios Personal', 'Oficinas de Despacho'],
    status: 'active',
    notes: 'Requiere elementos de protección personal (EPP) completos en depósito.',
    createdAt: '2026-07-20',
  },
];

// Reference date: Thursday, Nov 12, 2026
export const REFERENCE_DATE = '2026-11-12';
export const REFERENCE_DAY_NUMBER = 12;

// Generate visits for November 2026 (days 1 to 30) for each client
export const generateInitialVisits = (): Visit[] => {
  const visits: Visit[] = [];
  const clients = INITIAL_CLIENTS;

  clients.forEach((client) => {
    // Generate for all 30 days of November 2026
    for (let day = 1; day <= 30; day++) {
      const dateStr = `2026-11-${day.toString().padStart(2, '0')}`;
      // In Nov 2026: Nov 1 is Sunday, Nov 12 is Thursday, etc.
      // Day of week: (day + 5) % 7 where 0=Sun, 1=Mon, ..., 6=Sat
      const dateObj = new Date(2026, 10, day);
      const isSunday = dateObj.getDay() === 0;

      // Some clients don't operate on Sundays
      if (isSunday && client.id !== 'cli-4') continue;

      let status: Visit['status'] = 'Programada';
      let checkInTime: string | undefined = undefined;
      let checkOutTime: string | undefined = undefined;
      let verifiedAt: string | undefined = undefined;
      let verifiedBy: string | undefined = undefined;
      let declaredNotes: string | undefined = undefined;
      let supervisorNotes: string | undefined = undefined;

      const primaryStaff = client.assignedStaff[0] || 'Mariela Gómez';

      if (day < 12) {
        // Past days: mostly verified, a few declared or excused
        if (day === 8 && client.id === 'cli-2') {
          status = 'Ausente';
          declaredNotes = 'Aviso de ausencia justificada por parte médico. Cubrió relevo.';
        } else if (day === 11) {
          status = 'Verificada';
          checkInTime = '07:55';
          checkOutTime = '13:00';
          verifiedAt = '2026-11-11 15:30';
          verifiedBy = 'Carlos Benítez';
          supervisorNotes = 'Control de libro de actas y áreas comunes conforme.';
        } else {
          status = 'Verificada';
          checkInTime = '07:58';
          checkOutTime = '13:02';
          verifiedAt = `2026-11-${day.toString().padStart(2, '0')} 16:00`;
          verifiedBy = 'Carlos Benítez';
        }
      } else if (day === 12) {
        // TODAY (Jueves 12 de Noviembre de 2026)
        if (client.id === 'cli-1') {
          // Centro Médico Del Sol: Empleada Mariela Gómez registered check-in
          status = 'Declarada';
          checkInTime = '07:52';
          declaredNotes = 'Ingreso a horario. Comenzando desinfección en Guardia y Quirófanos.';
        } else if (client.id === 'cli-2') {
          // Colegio San Rafael: Empleada Mariela Gómez / Roberto Díaz declared, waiting for verification
          status = 'Declarada';
          checkInTime = '08:05';
          declaredNotes = 'Sanitarios y patio cubiertos de primaria limpios.';
        } else if (client.id === 'cli-4') {
          // Supermercado Los Álamos: Already verified by supervisor Carlos
          status = 'Verificada';
          checkInTime = '06:00';
          checkOutTime = '10:00';
          verifiedAt = '2026-11-12 10:15';
          verifiedBy = 'Carlos Benítez';
          supervisorNotes = 'Pisos lustrados a máquina en línea de cajas. Excelente.';
        } else if (client.id === 'cli-3') {
          status = 'Programada';
        } else if (client.id === 'cli-5') {
          status = 'Declarada';
          checkInTime = '07:15';
          declaredNotes = 'Repaso de hall y palieres en curso.';
        } else {
          status = 'Programada';
        }
      } else {
        // Future days: all Programada
        status = 'Programada';
      }

      visits.push({
        id: `vis-${client.id}-${day}`,
        clientId: client.id,
        clientName: client.name,
        date: dateStr,
        dayNumber: day,
        employeeId: client.id === 'cli-1' || client.id === 'cli-2' ? 'usr-empleado' : 'usr-staff',
        employeeName: primaryStaff,
        supervisorName: client.assignedSupervisor,
        shift: client.frequency,
        status,
        checkInTime,
        checkOutTime,
        declaredNotes,
        verifiedAt,
        verifiedBy,
        supervisorNotes,
      });
    }
  });

  return visits;
};

export const INITIAL_SUPERVISIONS: Supervision[] = [
  {
    id: 'sup-101',
    clientId: 'cli-4',
    clientName: 'Supermercado Los Álamos',
    supervisorName: 'Carlos Benítez',
    date: '2026-11-12',
    time: '10:15',
    checklist: {
      sanitarios: 'bien',
      vidrios: 'bien',
      pisos: 'bien',
      areasCriticas: 'bien',
      residuos: 'bien',
      insumos: 'bien',
    },
    overallScore: 9,
    observations: 'Auditoría presencial con el gerente Sergio Menéndez. Sector cajas y cámaras impecables.',
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-11-12 10:20:00',
  },
  {
    id: 'sup-100',
    clientId: 'cli-1',
    clientName: 'Centro Médico Del Sol',
    supervisorName: 'Carlos Benítez',
    date: '2026-11-10',
    time: '14:30',
    checklist: {
      sanitarios: 'bien',
      vidrios: 'regular',
      pisos: 'bien',
      areasCriticas: 'bien',
      residuos: 'bien',
      insumos: 'regular',
    },
    overallScore: 8,
    observations: 'Vidrios de fachada exterior tienen manchas por lluvia reciente. Se solicitó reposición de papel.',
    detectedTask: {
      title: 'Limpieza de vidrios exteriores fachada Bv. Oroño',
      priority: 'media',
      description: 'Programar cuadrilla con pértiga para lavado exterior de vidrios.',
      createdJobId: 'job-2',
    },
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-11-10 14:45:00',
  },
];

export const INITIAL_SUPPLY_ORDERS: SupplyOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'PED-2026-089',
    clientId: 'cli-1',
    clientName: 'Centro Médico Del Sol',
    requestedBy: 'Mariela Gómez',
    date: '2026-11-12',
    items: [
      { id: 'item-1', name: 'Papel Higiénico Institucional (bolsón x 4 u. 300m)', quantity: 6, unit: 'bolsones' },
      { id: 'item-2', name: 'Lavandina Concentrada 55g/L (bidón x 5L)', quantity: 4, unit: 'bidones' },
      { id: 'item-3', name: 'Jabón Líquido Antibacterial (bidón x 5L)', quantity: 2, unit: 'bidones' },
      { id: 'item-4', name: 'Bolsas de Residuos 80x110 Reforzadas', quantity: 3, unit: 'paquetes x 50u' },
    ],
    observations: 'Queda stock para solo 2 días en sector Quirófanos y Guardia.',
    status: 'Pendiente',
    updatedAt: '2026-11-12 08:30:00',
  },
  {
    id: 'ord-2',
    orderNumber: 'PED-2026-088',
    clientId: 'cli-2',
    clientName: 'Colegio San Rafael',
    requestedBy: 'Mariela Gómez',
    date: '2026-11-11',
    items: [
      { id: 'item-5', name: 'Detergente Concentrado Desengrasante (bidón x 5L)', quantity: 2, unit: 'bidones' },
      { id: 'item-6', name: 'Bolsas de Residuos 50x70 Negras', quantity: 5, unit: 'paquetes x 50u' },
      { id: 'item-7', name: 'Guantes de Látex Talle M', quantity: 2, unit: 'cajas x 100u' },
    ],
    observations: 'Insumos para sanitarios de nivel primario y secundario.',
    status: 'En preparación',
    updatedAt: '2026-11-11 16:20:00',
  },
  {
    id: 'ord-3',
    orderNumber: 'PED-2026-085',
    clientId: 'cli-4',
    clientName: 'Supermercado Los Álamos',
    requestedBy: 'Juan Pablo Roldán',
    date: '2026-11-09',
    items: [
      { id: 'item-8', name: 'Cera Autobrillo Incolora para Alto Tránsito (bidón x 5L)', quantity: 3, unit: 'bidones' },
      { id: 'item-9', name: 'Paños de Microfibra Profesionales', quantity: 4, unit: 'packs x 6u' },
      { id: 'item-10', name: 'Desodorante de Pisos Lavanda (bidón x 5L)', quantity: 2, unit: 'bidones' },
    ],
    observations: 'Para mantención programada de pisos de pasillos principales.',
    status: 'Entregado',
    remitoId: 'rem-139',
    updatedAt: '2026-11-10 11:00:00',
  },
];

export const INITIAL_REMITOS: Remito[] = [
  {
    id: 'rem-139',
    remitoNumber: 'R-0001-00000139',
    orderId: 'ord-3',
    clientId: 'cli-4',
    clientName: 'Supermercado Los Álamos',
    clientAddress: 'Av. Pellegrini 3820, Rosario',
    clientCuit: '30-64219003-7',
    deliveryDate: '2026-11-10',
    deliveredBy: 'Carlos Benítez (Supervisor CIMA)',
    receivedBy: 'Sergio Menéndez (Gerente de Sucursal)',
    items: [
      { id: 'item-8', name: 'Cera Autobrillo Incolora para Alto Tránsito (bidón x 5L)', quantity: 3, unit: 'bidones' },
      { id: 'item-9', name: 'Paños de Microfibra Profesionales', quantity: 4, unit: 'packs x 6u' },
      { id: 'item-10', name: 'Desodorante de Pisos Lavanda (bidón x 5L)', quantity: 2, unit: 'bidones' },
    ],
    status: 'Entregado',
    signatureData: 'Firma Conforme: S. Menéndez (DNI 28.491.022)',
    notes: 'Mercadería recibida en depósito central conforme a pedido PED-2026-085.',
    isFiscal: false,
    createdAt: '2026-11-10 10:45:00',
  },
  {
    id: 'rem-140',
    remitoNumber: 'R-0001-00000140',
    clientId: 'cli-5',
    clientName: 'Edificio Torre Alvear',
    clientAddress: 'Alvear 740, Rosario',
    clientCuit: '33-70891234-9',
    deliveryDate: '2026-11-11',
    deliveredBy: 'Matías Cima',
    receivedBy: 'Elena Martínez (Administración)',
    items: [
      { id: 'item-11', name: 'Lustrador de Metales y Bronce (frasco x 500ml)', quantity: 3, unit: 'unidades' },
      { id: 'item-12', name: 'Bolsas de Residuos 60x90 Negras', quantity: 4, unit: 'paquetes x 50u' },
      { id: 'item-13', name: 'Lavandina en Gel Concentrada', quantity: 2, unit: 'bidones x 5L' },
    ],
    status: 'En tránsito',
    notes: 'Entrega acordada con portería antes de las 12:00 hs.',
    isFiscal: false,
    createdAt: '2026-11-11 15:00:00',
  },
];

export const INITIAL_ADDITIONAL_JOBS: AdditionalJob[] = [
  {
    id: 'job-1',
    clientId: 'cli-1',
    clientName: 'Centro Médico Del Sol',
    title: 'Desinfección profunda de Quirófano 2 post-remodelación',
    description: 'Protocolo estéril completo con nebulización y sellado bacteriológico previo a habilitación sanitaria.',
    priority: 'alta',
    status: 'En curso',
    assignedStaff: 'Roberto Díaz',
    source: 'Solicitud Médica Urgente',
    targetDate: '2026-11-12',
    createdAt: '2026-11-11 18:00:00',
  },
  {
    id: 'job-2',
    clientId: 'cli-2',
    clientName: 'Colegio San Rafael',
    title: 'Limpieza de vidrios exteriores fachada sobre Mendoza',
    description: 'Cuadrilla especializada para remoción de polvillo y hollín en aberturas altas del frente histórico.',
    priority: 'media',
    status: 'Pendiente',
    assignedStaff: 'Mariela Gómez y Cuadrilla Altura',
    source: 'Supervisión #SUP-100',
    targetDate: '2026-11-14',
    createdAt: '2026-11-10 14:45:00',
  },
  {
    id: 'job-3',
    clientId: 'cli-5',
    clientName: 'Edificio Torre Alvear',
    title: 'Pulido diamantado y cristalizado de mármol en Hall PB',
    description: 'Tratamiento restaurador de brillo en solados de mármol travertino de entrada principal.',
    priority: 'baja',
    status: 'Finalizado',
    assignedStaff: 'Juan Pablo Roldán',
    source: 'Acuerdo Anual Consorcio',
    targetDate: '2026-11-08',
    completedAt: '2026-11-08 17:30:00',
    createdAt: '2026-11-05 09:00:00',
  },
  {
    id: 'job-4',
    clientId: 'cli-8',
    clientName: 'Logística Rivadavia S.A.',
    title: 'Desengrase intensivo de dársenas de descarga 3 y 4',
    description: 'Aplicación de detergente alcalino industrial con hidrolavadora 250 bar para remoción de derrames de aceite.',
    priority: 'alta',
    status: 'Pendiente',
    assignedStaff: 'Cuadrilla Pesada CIMA',
    source: 'Inspección de Seguridad e Higiene',
    targetDate: '2026-11-13',
    createdAt: '2026-11-11 11:20:00',
  },
];

export const CATALOG_SUPPLIES = [
  { id: 'cat-1', name: 'Papel Higiénico Institucional (bolsón x 4 u. 300m)', unit: 'bolsones' },
  { id: 'cat-2', name: 'Toallas de Papel Interdobladas (caja x 2.500 u.)', unit: 'cajas' },
  { id: 'cat-3', name: 'Jabón Líquido Antibacterial para Manos (bidón x 5L)', unit: 'bidones' },
  { id: 'cat-4', name: 'Lavandina Concentrada 55g/L (bidón x 5L)', unit: 'bidones' },
  { id: 'cat-5', name: 'Detergente Sintético Desengrasante (bidón x 5L)', unit: 'bidones' },
  { id: 'cat-6', name: 'Desinfectante de Pisos Fragancia Lavanda (bidón x 5L)', unit: 'bidones' },
  { id: 'cat-7', name: 'Bolsas de Residuos 80x110 Reforzadas Negras (paquete x 50 u.)', unit: 'paquetes' },
  { id: 'cat-8', name: 'Bolsas de Residuos 50x70 Medianas Negras (paquete x 50 u.)', unit: 'paquetes' },
  { id: 'cat-9', name: 'Bolsas Patogénicas Rojas 60x80 (paquete x 50 u.)', unit: 'paquetes' },
  { id: 'cat-10', name: 'Guantes de Látex Reforzados Talle M / L (caja x 100 u.)', unit: 'cajas' },
  { id: 'cat-11', name: 'Paños de Microfibra Hospitalarios (pack x 6 u.)', unit: 'packs' },
  { id: 'cat-12', name: 'Cera Autobrillo Acrílica Incolora (bidón x 5L)', unit: 'bidones' },
  { id: 'cat-13', name: 'Limpiador de Vidrios con Antiestático (bidón x 5L)', unit: 'bidones' },
  { id: 'cat-14', name: 'Alcohol al 70% Spray Sanitizante (bidón x 5L)', unit: 'bidones' },
];
