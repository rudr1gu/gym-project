import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { WorkoutDetails } from './pages/WorkoutDetails';

function App() {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  const handleSelectWorkout = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
  };

  const handleBack = () => {
    setSelectedWorkoutId(null);
  };

  return (
    <>
      {!selectedWorkoutId ? (
        <Dashboard onSelectWorkout={handleSelectWorkout} />
      ) : (
        <WorkoutDetails workoutId={selectedWorkoutId} onBack={handleBack} />
      )}
    </>
  );
}

export default App;
