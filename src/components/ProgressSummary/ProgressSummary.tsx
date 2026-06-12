import { CheckCircle, Target, TrendingUp, Trophy } from 'lucide-react';
import type { WorkoutStats } from '../../types/workout.types';
import { cn } from '../../utils/cn';

interface ProgressSummaryProps {
  stats: WorkoutStats;
  onReset: () => void;
}

export const ProgressSummary = ({ stats, onReset }: ProgressSummaryProps) => {
  const { totalWorkouts, completedWorkouts, totalExercises, completedExercises, progressPercentage } = stats;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Resumo da Semana
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
        >
          Resetar
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Progresso geral</span>
          <span className={cn(
            'font-bold text-lg',
            progressPercentage === 100 ? 'text-green-400' : 'text-white'
          )}>
            {progressPercentage}%
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 bg-gradient-to-r',
              progressPercentage === 100
                ? 'from-green-500 to-green-400'
                : 'from-blue-500 to-blue-400'
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500">Treinos</span>
          </div>
          <p className="text-xl font-bold text-white">
            <span className={completedWorkouts === totalWorkouts ? 'text-green-400' : ''}>
              {completedWorkouts}
            </span>
            <span className="text-gray-500 font-normal">/{totalWorkouts}</span>
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500">Exercícios</span>
          </div>
          <p className="text-xl font-bold text-white">
            <span className={completedExercises === totalExercises ? 'text-green-400' : ''}>
              {completedExercises}
            </span>
            <span className="text-gray-500 font-normal">/{totalExercises}</span>
          </p>
        </div>
      </div>

      {progressPercentage === 100 && (
        <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Semana completa!</span>
          </div>
        </div>
      )}
    </div>
  );
};
