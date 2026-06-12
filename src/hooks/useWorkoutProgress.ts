import { useState, useEffect, useCallback } from 'react';
import type { WorkoutProgress, ExerciseProgress, WeeklyProgress } from '../types/workout.types';
import {
  getProgress,
  getWorkoutProgress as getStoredWorkoutProgress,
  updateExerciseProgress,
  resetProgress as resetStoredProgress,
  resetWorkoutProgress as resetStoredWorkoutProgress,
} from '../services/workoutStorage.service';
import { calculateWeeklyStats } from '../utils/workoutProgress';

export const useWorkoutProgress = (workoutId?: string) => {
  const [progress, setProgress] = useState<WeeklyProgress | null>(null);
  const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedProgress = getProgress();
    setProgress(storedProgress);
    if (workoutId) {
      setWorkoutProgress(getStoredWorkoutProgress(workoutId));
    }
    setIsLoading(false);
  }, [workoutId]);

  const updateExercise = useCallback(
    (exerciseId: string, updates: Partial<ExerciseProgress>) => {
      if (!workoutId) return;

      updateExerciseProgress(workoutId, exerciseId, updates);

      const newProgress = getProgress();
      setProgress(newProgress);
      setWorkoutProgress(getStoredWorkoutProgress(workoutId));
    },
    [workoutId]
  );

  const toggleExerciseCompleted = useCallback(
    (exerciseId: string) => {
      if (!workoutProgress) return;

      const currentEx = workoutProgress.exercisesProgress.find(
        (e) => e.exerciseId === exerciseId
      );
      const newCompleted = !(currentEx?.completed ?? false);

      updateExercise(exerciseId, { completed: newCompleted });
    },
    [workoutProgress, updateExercise]
  );

  const resetAllProgress = useCallback(() => {
    resetStoredProgress();
    const newProgress = getProgress();
    setProgress(newProgress);
    if (workoutId) {
      setWorkoutProgress(getStoredWorkoutProgress(workoutId));
    }
  }, [workoutId]);

  const resetWorkout = useCallback(() => {
    if (!workoutId) return;
    resetStoredWorkoutProgress(workoutId);
    const newProgress = getProgress();
    setProgress(newProgress);
    setWorkoutProgress(getStoredWorkoutProgress(workoutId));
  }, [workoutId]);

  const stats = progress ? calculateWeeklyStats(progress.workoutsProgress) : null;

  return {
    progress,
    workoutProgress,
    stats,
    isLoading,
    updateExercise,
    toggleExerciseCompleted,
    resetAllProgress,
    resetWorkout,
  };
};
