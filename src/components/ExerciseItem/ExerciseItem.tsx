import { Check, Circle, Info, Timer, Repeat, Weight } from 'lucide-react';
import type { Exercise, ExerciseProgress } from '../../types/workout.types';
import { cn } from '../../utils/cn';

interface ExerciseItemProps {
  exercise: Exercise;
  progress?: ExerciseProgress;
  onToggleComplete: () => void;
  onWeightChange: (weight: string) => void;
  onRepsChange: (reps: string) => void;
}

export const ExerciseItem = ({
  exercise,
  progress,
  onToggleComplete,
  onWeightChange,
  onRepsChange,
}: ExerciseItemProps) => {
  const isCompleted = progress?.completed ?? false;

  return (
    <div
      className={cn(
        'rounded-xl p-4 border transition-all duration-200',
        isCompleted
          ? 'border-green-500/50 bg-green-500/5'
          : 'border-gray-800 bg-gray-800/30'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleComplete}
          className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5',
            isCompleted
              ? 'bg-green-500 border-green-500'
              : 'border-gray-600 hover:border-green-500 hover:bg-green-500/10'
          )}
        >
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              'font-semibold mb-1',
              isCompleted ? 'text-green-400 line-through' : 'text-white'
            )}
          >
            {exercise.name}
          </h4>

          <p className="text-xs text-gray-500 mb-2">
            {exercise.muscleGroup}
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Repeat className="w-4 h-4 text-blue-400" />
              <span>{exercise.sets} séries</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="w-4 h-4 text-green-400" />
              <span>{exercise.reps} reps</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4 text-yellow-400" />
              <span>{exercise.rest}</span>
            </div>
          </div>

          {exercise.notes && (
            <div className="flex gap-2 p-2 bg-gray-800/50 rounded-lg mb-3">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                {exercise.notes}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Weight className="w-3.5 h-3.5" />
                Carga usada (kg)
              </label>
              <input
                type="number"
                placeholder="Ex: 40"
                value={progress?.weight ?? ''}
                onChange={(e) => onWeightChange(e.target.value)}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-gray-800 border border-gray-700',
                  'text-white placeholder-gray-600',
                  'focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20',
                  'transition-colors'
                )}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Circle className="w-3.5 h-3.5" />
                Reps feitas
              </label>
              <input
                type="text"
                placeholder="Ex: 12,10,10,8"
                value={progress?.repsDone ?? ''}
                onChange={(e) => onRepsChange(e.target.value)}
                className={cn(
                  'w-full px-3 py-2 rounded-lg text-sm',
                  'bg-gray-800 border border-gray-700',
                  'text-white placeholder-gray-600',
                  'focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20',
                  'transition-colors'
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
