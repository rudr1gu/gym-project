import { ChevronRight, Check, Target } from 'lucide-react';
import type { Workout } from '../../types/workout.types';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';
import { getWorkoutProgressPercentage, getCompletedExercisesCount } from '../../utils/workoutProgress';
import type { WorkoutProgress } from '../../types/workout.types';

interface WorkoutCardProps {
  workout: Workout;
  workoutProgress?: WorkoutProgress;
  onClick: () => void;
}

export const WorkoutCard = ({ workout, workoutProgress, onClick }: WorkoutCardProps) => {
  const progressPercentage = getWorkoutProgressPercentage(workout, workoutProgress);
  const completedExercises = getCompletedExercisesCount(workout, workoutProgress);
  const totalExercises = workout.exercises.length;
  const isCompleted = progressPercentage === 100;
  const isOptional = workout.dayType === 'optional';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl p-4 transition-all duration-200',
        'border border-gray-800 hover:border-gray-700 hover:bg-gray-800/50',
        'active:scale-[0.98]',
        isCompleted && 'border-green-500/50 bg-green-500/5'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white truncate">
              {workout.title}
            </h3>
            {isOptional && <Badge variant="optional">Opcional</Badge>}
            {isCompleted && !isOptional && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-2">{workout.subtitle}</p>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <Target className="w-3.5 h-3.5" />
            <span className="truncate">{workout.focus}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  isCompleted ? 'bg-green-500' : 'bg-blue-500'
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-300 tabular-nums">
              {completedExercises}/{totalExercises}
            </span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
      </div>
    </button>
  );
};
