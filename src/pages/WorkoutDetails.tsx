import { ArrowLeft, RotateCcw, Target, CheckCircle, Printer } from 'lucide-react';
import { Layout } from '../components/Layout';
import { ExerciseItem } from '../components/ExerciseItem';
import { Badge } from '../components/Badge';
import { getWorkoutById } from '../data/workouts.mock';
import { useWorkoutProgress } from '../hooks/useWorkoutProgress';
import { getWorkoutProgressPercentage, getCompletedExercisesCount } from '../utils/workoutProgress';
import { cn } from '../utils/cn';

interface WorkoutDetailsProps {
  workoutId: string;
  onBack: () => void;
}

const formatWorkoutDate = (completedAt?: string) => {
  const date = completedAt ? new Date(completedAt) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(safeDate);
};

export const WorkoutDetails = ({ workoutId, onBack }: WorkoutDetailsProps) => {
  const workout = getWorkoutById(workoutId);
  const { workoutProgress, isLoading, updateExercise, toggleExerciseCompleted, resetWorkout } =
    useWorkoutProgress(workoutId);

  if (isLoading || !workout) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const progressPercentage = getWorkoutProgressPercentage(workout, workoutProgress);
  const completedExercises = getCompletedExercisesCount(workout, workoutProgress);
  const totalExercises = workout.exercises.length;
  const isOptional = workout.dayType === 'optional';
  const isWorkoutComplete = progressPercentage === 100;
  const workoutDay = formatWorkoutDate(workoutProgress?.completedAt);
  const completedExerciseRows = workout.exercises
    .map((exercise) => ({
      exercise,
      progress: workoutProgress?.exercisesProgress.find((p) => p.exerciseId === exercise.id),
    }))
    .filter(({ progress }) => progress?.completed === true);

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <Layout title={workout.title}>
      <div className="workout-screen space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{workout.title}</h1>
                {isOptional && <Badge variant="optional">Opcional</Badge>}
              </div>
              <p className="text-gray-400">{workout.subtitle}</p>
            </div>
            <button
              onClick={resetWorkout}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Resetar treino"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start gap-2 p-3 bg-gray-900/50 rounded-lg mb-4">
            <Target className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">{workout.focus}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progresso</span>
              <span className="flex items-center gap-2 font-medium">
                {progressPercentage === 100 ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : null}
                <span
                  className={cn(
                    progressPercentage === 100 ? 'text-green-400' : 'text-white'
                  )}
                >
                  {completedExercises}/{totalExercises} exercícios
                </span>
              </span>
            </div>
            <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  progressPercentage === 100
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : 'bg-gradient-to-r from-blue-500 to-blue-400'
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {isWorkoutComplete && (
            <button
              type="button"
              onClick={handleExportPdf}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-400"
            >
              <Printer className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Exercícios
          </h2>
          <div className="space-y-3">
            {workout.exercises.map((exercise) => {
              const exerciseProgress = workoutProgress?.exercisesProgress.find(
                (p) => p.exerciseId === exercise.id
              );

              return (
                <ExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  progress={exerciseProgress}
                  onToggleComplete={() => toggleExerciseCompleted(exercise.id)}
                  onWeightChange={(weight) =>
                    updateExercise(exercise.id, { weight })
                  }
                  onRepsChange={(repsDone) =>
                    updateExercise(exercise.id, { repsDone })
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      {isWorkoutComplete && (
        <section className="workout-print-report" aria-label="Relatorio do treino">
          <header className="print-report-header">
            <p>Gym Tracker</p>
            <h1>Relatorio de treino</h1>
            <span>{workout.title}</span>
          </header>

          <dl className="print-report-meta">
            <div>
              <dt>Dia do treino</dt>
              <dd>{workoutDay}</dd>
            </div>
            <div>
              <dt>Treino</dt>
              <dd>
                {workout.title} - {workout.subtitle}
              </dd>
            </div>
            <div>
              <dt>Foco</dt>
              <dd>{workout.focus}</dd>
            </div>
          </dl>

          <table className="print-report-table">
            <thead>
              <tr>
                <th>Exercicio feito</th>
                <th>Series planejadas</th>
                <th>Repeticoes planejadas</th>
                <th>Carga usada</th>
                <th>Repeticoes feitas</th>
              </tr>
            </thead>
            <tbody>
              {completedExerciseRows.length > 0 ? (
                completedExerciseRows.map(({ exercise, progress }) => (
                  <tr key={exercise.id}>
                    <td>{exercise.name}</td>
                    <td>{exercise.sets}</td>
                    <td>{exercise.reps}</td>
                    <td>{progress?.weight ? `${progress.weight} kg` : 'Nao informado'}</td>
                    <td>{progress?.repsDone || 'Nao informado'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Nenhum exercicio marcado como feito.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </Layout>
  );
};
