export type MuscleGroup =
  | 'costas'
  | 'bíceps'
  | 'peito'
  | 'ombro'
  | 'ombro lateral'
  | 'posterior de ombro'
  | 'tríceps'
  | 'pernas'
  | 'quadríceps'
  | 'posterior de coxa'
  | 'posterior/glúteo/lombar'
  | 'panturrilha'
  | 'bíceps/antebraço'
  | 'dorsal';

export type DayType = 'fixed' | 'optional';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
  muscleGroup: MuscleGroup;
  isOptional?: boolean;
}

export interface Workout {
  id: string;
  title: string;
  subtitle: string;
  focus: string;
  dayType: DayType;
  exercises: Exercise[];
}

export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  weight: string;
  repsDone: string;
  notes: string;
}

export interface WorkoutProgress {
  workoutId: string;
  exercisesProgress: ExerciseProgress[];
}

export interface WeeklyProgress {
  workoutsProgress: WorkoutProgress[];
  lastUpdated: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  completedWorkouts: number;
  totalExercises: number;
  completedExercises: number;
  progressPercentage: number;
}
