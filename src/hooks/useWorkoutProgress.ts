import { useState, useEffect, useCallback } from 'react';
import type { WorkoutProgress, ExerciseProgress, WeeklyProgress } from '../types/workout.types';
import { getWorkoutById } from '../data/workouts.mock';
import {
  getProgress,
  getWorkoutProgress as getStoredWorkoutProgress,
  updateExerciseProgress,
  updateWorkoutCompletion,
  resetProgress as resetStoredProgress,
  resetWorkoutProgress as resetStoredWorkoutProgress,
} from '../services/workoutStorage.service';
import { calculateWeeklyStats, isWorkoutCompleted } from '../utils/workoutProgress';

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

      const updatedWorkoutProgress = getStoredWorkoutProgress(workoutId);
      const workout = getWorkoutById(workoutId);

      if (workout && updatedWorkoutProgress) {
        updateWorkoutCompletion(
          workoutId,
          isWorkoutCompleted(workout, updatedWorkoutProgress)
        );
      }

      const newProgress = getProgress();
      setProgress(newProgress);
      setWorkoutProgress(getStoredWorkoutProgress(workoutId));
    },
    [workoutId]
  );

  const toggleExerciseCompleted = useCallback(
    (exerciseId: string) => {
      const currentEx = workoutProgress?.exercisesProgress.find(
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
