// Rutina de gimnasio del plan del nutriólogo + tipos adicionales

export type WorkoutType = 'gym' | 'pilates' | 'home' | 'cardio' | 'walk';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // puede ser "12" o "20-30 seg"
  unit: 'reps' | 'seconds';
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  type: WorkoutType;
  day?: number; // Día del plan (1, 2)
  warmupMinutes: number;
  cardioMinutes: number;
  exercises: Exercise[];
  cardioDescription?: string;
  notes?: string;
}

export const workoutTemplates: WorkoutTemplate[] = [
  // ─── DÍA 1 ────────────────────────────────────────────────────────────────
  {
    id: 'gym-day-1',
    name: 'Día 1 — Cuerpo completo + Cardio',
    type: 'gym',
    day: 1,
    warmupMinutes: 10,
    cardioMinutes: 20,
    cardioDescription: 'Caminadora con ligera inclinación o bicicleta estática',
    exercises: [
      {
        id: 'g1-e1',
        name: 'Prensa de pierna',
        sets: 3,
        reps: '12',
        unit: 'reps',
        notes: 'Descanso 60–90 seg',
      },
      {
        id: 'g1-e2',
        name: 'Jalón al pecho en polea',
        sets: 3,
        reps: '12',
        unit: 'reps',
        notes: 'Descanso 60–90 seg',
      },
      {
        id: 'g1-e3',
        name: 'Press de pecho en máquina',
        sets: 3,
        reps: '12',
        unit: 'reps',
        notes: 'Descanso 60–90 seg',
      },
      {
        id: 'g1-e4',
        name: 'Peso muerto con mancuernas ligeras',
        sets: 3,
        reps: '10',
        unit: 'reps',
        notes: 'Descanso 60–90 seg',
      },
      {
        id: 'g1-e5',
        name: 'Abducción de cadera en máquina',
        sets: 3,
        reps: '15',
        unit: 'reps',
        notes: 'Descanso 60–90 seg',
      },
      {
        id: 'g1-e6',
        name: 'Plancha modificada (rodillas apoyadas)',
        sets: 3,
        reps: '30',
        unit: 'seconds',
        notes: '20–30 segundos por serie',
      },
    ],
    notes: 'Intensidad: 6–7/10. Trabajar en máquinas para mayor seguridad.',
  },

  // ─── DÍA 2 ────────────────────────────────────────────────────────────────
  {
    id: 'gym-day-2',
    name: 'Día 2 — Fuerza funcional + Intervalos',
    type: 'gym',
    day: 2,
    warmupMinutes: 8,
    cardioMinutes: 15,
    cardioDescription: 'Intervalos: 1 min rápido / 2 min suave × 4–5 veces',
    exercises: [
      {
        id: 'g2-e1',
        name: 'Sentadilla goblet con mancuerna',
        sets: 3,
        reps: '12',
        unit: 'reps',
        notes: 'Circuito — descanso 1 min entre vueltas',
      },
      {
        id: 'g2-e2',
        name: 'Remo en polea baja',
        sets: 3,
        reps: '12',
        unit: 'reps',
        notes: 'Circuito',
      },
      {
        id: 'g2-e3',
        name: 'Step-up en banco bajo',
        sets: 3,
        reps: '10 por pierna',
        unit: 'reps',
        notes: 'Circuito — 10 repeticiones por cada pierna',
      },
      {
        id: 'g2-e4',
        name: 'Press de hombro con mancuernas',
        sets: 3,
        reps: '12',
        unit: 'reps',
        notes: 'Circuito — mancuernas ligeras',
      },
      {
        id: 'g2-e5',
        name: 'Puente de glúteo en colchoneta',
        sets: 3,
        reps: '15',
        unit: 'reps',
        notes: 'Circuito',
      },
      {
        id: 'g2-e6',
        name: 'Crunch abdominal controlado',
        sets: 3,
        reps: '12',
        unit: 'reps',
        notes: 'Circuito — controlado, sin impulso',
      },
    ],
    notes: 'Realizar en circuito completo × 3 vueltas. Descanso 1 min entre vueltas.',
  },

  // ─── PILATES ──────────────────────────────────────────────────────────────
  {
    id: 'pilates-reformer',
    name: 'Pilates Reformer',
    type: 'pilates',
    warmupMinutes: 5,
    cardioMinutes: 0,
    exercises: [],
    notes: 'Registrar duración, instructor y sensaciones de la sesión.',
  },

  // ─── CASA ─────────────────────────────────────────────────────────────────
  {
    id: 'home-workout',
    name: 'Entrenamiento en casa',
    type: 'home',
    warmupMinutes: 5,
    cardioMinutes: 0,
    exercises: [
      {
        id: 'h-e1',
        name: 'Sentadillas',
        sets: 3,
        reps: '15',
        unit: 'reps',
      },
      {
        id: 'h-e2',
        name: 'Flexiones (rodillas apoyadas)',
        sets: 3,
        reps: '10',
        unit: 'reps',
      },
      {
        id: 'h-e3',
        name: 'Puente de glúteo',
        sets: 3,
        reps: '15',
        unit: 'reps',
      },
      {
        id: 'h-e4',
        name: 'Zancadas alternas',
        sets: 3,
        reps: '10 por pierna',
        unit: 'reps',
      },
      {
        id: 'h-e5',
        name: 'Plancha',
        sets: 3,
        reps: '30',
        unit: 'seconds',
      },
    ],
    notes: 'Rutina básica de fuerza en casa. Se puede hacer 3 veces/semana.',
  },
];

export function getWorkoutById(id: string): WorkoutTemplate | undefined {
  return workoutTemplates.find((w) => w.id === id);
}
