import React, { useState } from 'react';
import { WorkoutPlan, PlanExercise } from '../types';

interface Props {
    plans: WorkoutPlan[];
    addPlan: (plan: Omit<WorkoutPlan, 'id'>) => void;
    deletePlan: (id: string) => void;
}

const WorkoutPlans: React.FC<Props> = ({ plans, addPlan, deletePlan }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanExercises, setNewPlanExercises] = useState<Omit<PlanExercise, 'id'>[]>([{ name: '', sets: 3, reps: 10 }]);

    const handleAddExercise = () => {
        setNewPlanExercises([...newPlanExercises, { name: '', sets: 3, reps: 10 }]);
    };
    
    const handleExerciseChange = (index: number, field: keyof Omit<PlanExercise, 'id'>, value: string | number) => {
        const updatedExercises = [...newPlanExercises];
        (updatedExercises[index] as any)[field] = value;
        setNewPlanExercises(updatedExercises);
    };

    const handleRemoveExercise = (index: number) => {
        setNewPlanExercises(newPlanExercises.filter((_, i) => i !== index));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlanName.trim() || newPlanExercises.some(ex => !ex.name.trim())) {
            alert('Please fill out the plan name and all exercise names.');
            return;
        }
        addPlan({ name: newPlanName, exercises: newPlanExercises.map(ex => ({...ex, id: crypto.randomUUID()})) });
        // Reset form
        setIsCreating(false);
        setNewPlanName('');
        setNewPlanExercises([{ name: '', sets: 3, reps: 10 }]);
    };

    const PlanCreator = () => (
        <div className="bg-gray-800 rounded-lg p-6 space-y-4 mb-6">
            <h3 className="text-xl font-bold text-white">Create New Plan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Plan Name (e.g., Push Day)" value={newPlanName} onChange={e => setNewPlanName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" required />
                
                <div className="space-y-3">
                    {newPlanExercises.map((ex, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <input type="text" placeholder="Exercise Name" value={ex.name} onChange={e => handleExerciseChange(index, 'name', e.target.value)}
                                className="col-span-6 bg-gray-700 border-gray-600 rounded-md py-1 px-2 text-white text-sm" required />
                            <input type="number" value={ex.sets} onChange={e => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                                className="col-span-2 bg-gray-700 border-gray-600 rounded-md py-1 px-2 text-white text-sm" min="1" />
                            <span className="col-span-1 text-center text-xs text-gray-400">sets</span>
                            <input type="number" value={ex.reps} onChange={e => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                                className="col-span-2 bg-gray-700 border-gray-600 rounded-md py-1 px-2 text-white text-sm" min="1" />
                             <span className="col-span-1 text-center text-xs text-gray-400">reps</span>
                            <button type="button" onClick={() => handleRemoveExercise(index)} className="text-gray-500 hover:text-red-500">
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={handleAddExercise} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">+ Add Exercise</button>
                
                <div className="flex gap-4">
                    <button type="button" onClick={() => setIsCreating(false)} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Save Plan</button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Workout Plans</h2>
                {!isCreating && <button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">+ New Plan</button>}
            </div>

            {isCreating && <PlanCreator />}
            
            {plans.length > 0 ? (
                <div className="space-y-4">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-gray-800 rounded-lg shadow-md p-4 relative">
                            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                            <ul className="list-disc list-inside mt-2 text-gray-300 text-sm">
                                {plan.exercises.map((ex, idx) => (
                                    <li key={idx}>{ex.name} ({ex.sets}x{ex.reps})</li>
                                ))}
                            </ul>
                            <button onClick={() => deletePlan(plan.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                !isCreating && <div className="text-center py-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No workout plans created yet.</p>
                </div>
            )}
        </div>
    );
};

export default WorkoutPlans;
