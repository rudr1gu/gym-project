import { Layout } from '../components/Layout';
import { WorkoutCard } from '../components/WorkoutCard';
import { ProgressSummary } from '../components/ProgressSummary';
import { workouts } from '../data/workouts.mock';
import { useWorkoutProgress } from '../hooks/useWorkoutProgress';

interface DashboardProps {
  onSelectWorkout: (workoutId: string) => void;
}

export const Dashboard = ({ onSelectWorkout }: DashboardProps) => {
  const { progress, stats, isLoading, resetAllProgress } = useWorkoutProgress();

  if (isLoading) {
    return (
      <Layout title="Carregando...">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Seus treinos">
      <div className="space-y-6">
        {stats && (
          <ProgressSummary stats={stats} onReset={resetAllProgress} />
        )}

        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Treinos da Semana
          </h2>
          <div className="space-y-3">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                workoutProgress={progress?.workoutsProgress.find(
                  (w) => w.workoutId === workout.id
                )}
                onClick={() => onSelectWorkout(workout.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
