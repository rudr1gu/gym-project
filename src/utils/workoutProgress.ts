import type { Workout, WorkoutProgress, WorkoutStats } from '../types/workout.types';
import { workouts } from '../data/workouts.mock';

export const isWorkoutCompleted = (
  workout: Workout,
  workoutProgress?: WorkoutProgress
): boolean => {
  if (!workoutProgress) return false;

  const mandatoryExercises = workout.exercises.filter((ex) => !ex.isOptional);
  if (mandatoryExercises.length === 0) return true;

  return mandatoryExercises.every((exercise) => {
    const exerciseProgress = workoutProgress.exercisesProgress.find(
      (p) => p.exerciseId === exercise.id
    );
    return exerciseProgress?.completed === true;
  });
};

export const getWorkoutProgressPercentage = (
  workout: Workout,
  workoutProgress?: WorkoutProgress
): number => {
  const mandatoryExercises = workout.exercises.filter((ex) => !ex.isOptional);
  if (mandatoryExercises.length === 0) return 100;

  if (!workoutProgress) return 0;

  const completedCount = mandatoryExercises.filter((exercise) => {
    const exerciseProgress = workoutProgress.exercisesProgress.find(
      (p) => p.exerciseId === exercise.id
    );
    return exerciseProgress?.completed === true;
  }).length;

  return Math.round((completedCount / mandatoryExercises.length) * 100);
};

export const calculateWeeklyStats = (
  workoutsProgress: WorkoutProgress[]
): WorkoutStats => {
  const fixedWorkouts = workouts.filter((w) => w.dayType === 'fixed');

  const totalWorkouts = fixedWorkouts.length;
  let completedWorkouts = 0;
  let totalExercises = 0;
  let completedExercises = 0;

  fixedWorkouts.forEach((workout) => {
    const mandatoryExercises = workout.exercises.filter((ex) => !ex.isOptional);
    totalExercises += mandatoryExercises.length;

    const workoutProg = workoutsProgress.find((w) => w.workoutId === workout.id);

    if (workoutProg) {
      const completedCount = mandatoryExercises.filter((exercise) => {
        const exProg = workoutProg.exercisesProgress.find(
          (p) => p.exerciseId === exercise.id
        );
        return exProg?.completed === true;
      }).length;

      completedExercises += completedCount;

      if (completedCount === mandatoryExercises.length) {
        completedWorkouts++;
      }
    }
  });

  const progressPercentage =
    totalExercises > 0
      ? Math.round((completedExercises / totalExercises) * 100)
      : 0;

  return {
    totalWorkouts,
    completedWorkouts,
    totalExercises,
    completedExercises,
    progressPercentage,
  };
};

export const getCompletedExercisesCount = (
  workout: Workout,
  workoutProgress?: WorkoutProgress
): number => {
  if (!workoutProgress) return 0;

  const mandatoryExercises = workout.exercises.filter((ex) => !ex.isOptional);
  const mandatoryIds = new Set(mandatoryExercises.map((ex) => ex.id));

  return workoutProgress.exercisesProgress.filter(
    (p) => p.completed === true && mandatoryIds.has(p.exerciseId)
  ).length;
};
