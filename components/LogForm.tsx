import React, { useState, useEffect } from 'react';
import { ActivityType, Activity, WorkoutPlan, SetLog, WeightLiftingLog } from '../types';
import SwimmingForm from './SwimmingForm';
import RunningForm from './RunningForm';

interface LogFormProps {
    type: ActivityType;
    addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
    onLogComplete: () => void;
    workoutPlans: WorkoutPlan[];
    activities: Activity[];
}

type WorkoutLogData = {
    exerciseName: string;
    sets: { reps: string; weight: string }[];
};

const WeightLiftingLogger: React.FC<Omit<LogFormProps, 'type'>> = ({ addActivity, workoutPlans, activities, onLogComplete }) => {
    const [selectedPlanId, setSelectedPlanId] = useState<string>('freestyle');
    const [workoutData, setWorkoutData] = useState<WorkoutLogData[]>([]);

    useEffect(() => {
        // Find last workout for a plan
        const findLastWorkoutForPlan = (planId: string): WeightLiftingLog[] => {
            const planActivities = activities.filter(
                a => a.type === ActivityType.WEIGHT_LIFTING && a.workoutPlanId === planId
            ) as WeightLiftingLog[];

            if (planActivities.length === 0) return [];
            
            const lastDate = planActivities.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
            
            return planActivities.filter(a => a.date === lastDate);
        };

        if (selectedPlanId === 'freestyle') {
            setWorkoutData([{ exerciseName: '', sets: [{ reps: '', weight: '' }] }]);
        } else {
            const plan = workoutPlans.find(p => p.id === selectedPlanId);
            if (plan) {
                const lastWorkout = findLastWorkoutForPlan(plan.id);

                const data = plan.exercises.map(ex => {
                    const lastExerciseLog = lastWorkout.find(log => log.exercise === ex.name);
                    const initialSets = Array.from({ length: ex.sets }, (_, i) => {
                         const lastSet = lastExerciseLog?.sets[i];
                         return { reps: String(ex.reps || ''), weight: String(lastSet?.weight || '0') };
                    });
                    return { exerciseName: ex.name, sets: initialSets };
                });
                setWorkoutData(data);
            }
        }
    }, [selectedPlanId, workoutPlans, activities]);

    const handleSetChange = (exIndex: number, setIndex: number, field: 'reps' | 'weight', value: string) => {
        const newData = [...workoutData];
        newData[exIndex].sets[setIndex][field] = value;
        setWorkoutData(newData);
    };
    
    const handleExerciseNameChange = (exIndex: number, name: string) => {
        const newData = [...workoutData];
        newData[exIndex].exerciseName = name;
        setWorkoutData(newData);
    }

    const addSet = (exIndex: number) => {
        const newData = [...workoutData];
        newData[exIndex].sets.push({ reps: '', weight: '' });
        setWorkoutData(newData);
    };

    const removeSet = (exIndex: number, setIndex: number) => {
        const newData = [...workoutData];
        newData[exIndex].sets.splice(setIndex, 1);
        setWorkoutData(newData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const plan = workoutPlans.find(p => p.id === selectedPlanId);

        workoutData.forEach(log => {
            if (log.exerciseName && log.sets.some(s => s.reps && s.weight)) {
                addActivity({
                    type: ActivityType.WEIGHT_LIFTING,
                    exercise: log.exerciseName,
                    sets: log.sets.map(s => ({ reps: parseInt(s.reps), weight: parseFloat(s.weight) })),
                    workoutPlanId: selectedPlanId !== 'freestyle' ? selectedPlanId : undefined,
                    workoutPlanName: selectedPlanId !== 'freestyle' ? plan?.name : undefined,
                });
            }
        });
        onLogComplete();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="plan-select" className="block text-sm font-medium text-gray-400 mb-1">Workout Plan</label>
                <select id="plan-select" value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="freestyle">Freestyle Workout</option>
                    {workoutPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                </select>
            </div>

            {workoutData.map((exerciseLog, exIndex) => (
                <div key={exIndex} className="p-4 border border-gray-700 rounded-lg space-y-3">
                    {selectedPlanId === 'freestyle' ? (
                         <input type="text" value={exerciseLog.exerciseName} onChange={e => handleExerciseNameChange(exIndex, e.target.value)}
                            className="block w-full bg-gray-600 border border-gray-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-semibold"
                            placeholder="Exercise Name" required />
                    ) : (
                        <h3 className="text-lg font-semibold text-indigo-300">{exerciseLog.exerciseName}</h3>
                    )}

                    {exerciseLog.sets.map((set, setIndex) => (
                        <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                            <span className="col-span-1 text-gray-400 text-sm">#{setIndex + 1}</span>
                             <div className="col-span-5">
                                <label className="sr-only">Reps</label>
                                <input type="number" placeholder="Reps" value={set.reps} onChange={e => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                                    className="block w-full bg-gray-700 border-gray-600 rounded-md py-1 px-2 text-white text-sm" required />
                            </div>
                            <div className="col-span-5">
                                <label className="sr-only">Weight</label>
                                <input type="number" placeholder="Weight (kg)" value={set.weight} onChange={e => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
                                    className="block w-full bg-gray-700 border-gray-600 rounded-md py-1 px-2 text-white text-sm" step="0.25" required />
                            </div>
                            <button type="button" onClick={() => removeSet(exIndex, setIndex)}
                                className="col-span-1 text-gray-500 hover:text-red-500">
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                    ))}
                     <button type="button" onClick={() => addSet(exIndex)} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                        + Add Set
                    </button>
                </div>
            ))}

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">
                Log Workout
            </button>
        </form>
    );
};


const LogForm: React.FC<LogFormProps> = ({ type, addActivity, onLogComplete, ...props }) => {
    const onSingleAdd = (log: Omit<Activity, 'id' | 'date'>) => {
        addActivity({ type, ...log });
        onLogComplete();
    };

    const renderForm = () => {
        switch (type) {
            case ActivityType.WEIGHT_LIFTING:
                return <WeightLiftingLogger addActivity={addActivity} onLogComplete={onLogComplete} {...props} />;
            case ActivityType.SWIMMING:
                return <SwimmingForm addActivity={onSingleAdd} />;
            case ActivityType.RUNNING:
                return <RunningForm addActivity={onSingleAdd} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-300 mb-4 border-t border-gray-700 pt-4">Log Your Workout</h2>
            {renderForm()}
        </div>
    );
};

export default LogForm;
