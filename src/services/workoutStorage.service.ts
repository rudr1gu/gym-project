import type { WeeklyProgress, WorkoutProgress, ExerciseProgress } from '../types/workout.types';

const STORAGE_KEY = 'gym-tracker-progress';

const getDefaultProgress = (): WeeklyProgress => ({
  workoutsProgress: [],
  lastUpdated: new Date().toISOString(),
});

export const getProgress = (): WeeklyProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultProgress();
    return JSON.parse(stored) as WeeklyProgress;
  } catch {
    return getDefaultProgress();
  }
};

export const saveProgress = (progress: WeeklyProgress): void => {
  const updated = {
    ...progress,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getWorkoutProgress = (workoutId: string): WorkoutProgress | undefined => {
  const progress = getProgress();
  return progress.workoutsProgress.find((w) => w.workoutId === workoutId);
};

export const saveWorkoutProgress = (workoutProgress: WorkoutProgress): void => {
  const progress = getProgress();
  const existingIndex = progress.workoutsProgress.findIndex(
    (w) => w.workoutId === workoutProgress.workoutId
  );

  if (existingIndex >= 0) {
    progress.workoutsProgress[existingIndex] = workoutProgress;
  } else {
    progress.workoutsProgress.push(workoutProgress);
  }

  saveProgress(progress);
};

export const updateWorkoutCompletion = (
  workoutId: string,
  isCompleted: boolean
): void => {
  const progress = getProgress();
  const workoutProgress = progress.workoutsProgress.find((w) => w.workoutId === workoutId);

  if (!workoutProgress) return;

  if (isCompleted && !workoutProgress.completedAt) {
    workoutProgress.completedAt = new Date().toISOString();
    saveProgress(progress);
    return;
  }

  if (!isCompleted && workoutProgress.completedAt) {
    delete workoutProgress.completedAt;
    saveProgress(progress);
  }
};

export const updateExerciseProgress = (
  workoutId: string,
  exerciseId: string,
  updates: Partial<ExerciseProgress>
): void => {
  const progress = getProgress();
  let workoutProgress = progress.workoutsProgress.find((w) => w.workoutId === workoutId);

  if (!workoutProgress) {
    workoutProgress = {
      workoutId,
      exercisesProgress: [],
    };
    progress.workoutsProgress.push(workoutProgress);
  }

  let exerciseProgress = workoutProgress.exercisesProgress.find(
    (e) => e.exerciseId === exerciseId
  );

  if (!exerciseProgress) {
    exerciseProgress = {
      exerciseId,
      completed: false,
      weight: '',
      repsDone: '',
      notes: '',
    };
    workoutProgress.exercisesProgress.push(exerciseProgress);
  }

  Object.assign(exerciseProgress, updates);
  saveProgress(progress);
};

export const getExerciseProgress = (
  workoutId: string,
  exerciseId: string
): ExerciseProgress | undefined => {
  const workoutProgress = getWorkoutProgress(workoutId);
  if (!workoutProgress) return undefined;
  return workoutProgress.exercisesProgress.find((e) => e.exerciseId === exerciseId);
};

export const resetProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const resetWorkoutProgress = (workoutId: string): void => {
  const progress = getProgress();
  progress.workoutsProgress = progress.workoutsProgress.filter(
    (w) => w.workoutId !== workoutId
  );
  saveProgress(progress);
};
