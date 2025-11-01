import React, { useState, useMemo } from 'react';
import { ActivityType, Activity, View, WorkoutPlan, BodyWeightEntry } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import ActivitySelector from './components/ActivitySelector';
import LogForm from './components/LogForm';
import ActivityHistory from './components/ActivityHistory';
import Dashboard from './components/Dashboard';
import WorkoutTip from './components/WorkoutTip';
import { BottomNavBar } from './components/BottomNavBar';
import { PlusIcon } from './components/Icons';
import WorkoutPlans from './components/WorkoutPlans';
import BodyWeightTracker from './components/BodyWeightTracker';

const App: React.FC = () => {
    const [activities, setActivities] = useLocalStorage<Activity[]>('activities', []);
    const [workoutPlans, setWorkoutPlans] = useLocalStorage<WorkoutPlan[]>('workoutPlans', []);
    const [bodyWeightHistory, setBodyWeightHistory] = useLocalStorage<BodyWeightEntry[]>('bodyWeightHistory', []);
    
    const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>(ActivityType.WEIGHT_LIFTING);
    const [currentView, setCurrentView] = useState<View>(View.LOG);
    
    const addActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
        const newActivity: Activity = {
            ...activity,
            id: new Date().toISOString() + Math.random(),
            date: new Date().toISOString(),
        } as Activity;
        setActivities(prev => [newActivity, ...prev]);
        // Do not switch view automatically when logging multiple exercises from a plan
        // The LogForm will handle the view switch.
    };

    const deleteActivity = (id: string) => {
        setActivities(activities.filter(activity => activity.id !== id));
    };

    const addPlan = (plan: Omit<WorkoutPlan, 'id'>) => {
        const newPlan = { ...plan, id: new Date().toISOString() };
        setWorkoutPlans(prev => [...prev, newPlan]);
    };

    const deletePlan = (id: string) => {
        setWorkoutPlans(plans => plans.filter(p => p.id !== id));
    };
    
    const addBodyWeightEntry = (entry: Omit<BodyWeightEntry, 'id' | 'date'>) => {
        const newEntry = { ...entry, id: new Date().toISOString(), date: new Date().toISOString() };
        setBodyWeightHistory(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
            <Header />
            <main className="pb-24 p-4 max-w-4xl mx-auto">
                {currentView === View.LOG && (
                     <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                        <ActivitySelector 
                            selectedActivity={selectedActivityType} 
                            setSelectedActivity={setSelectedActivityType} 
                        />
                        <LogForm 
                            type={selectedActivityType} 
                            addActivity={addActivity} 
                            workoutPlans={workoutPlans}
                            activities={activities}
                            onLogComplete={() => setCurrentView(View.HISTORY)}
                        />
                    </div>
                )}
                
                {currentView === View.HISTORY && (
                   <ActivityHistory 
                        activities={activities} 
                        deleteActivity={deleteActivity}
                    />
                )}

                {currentView === View.DASHBOARD && (
                    <Dashboard activities={activities} />
                )}
                
                {currentView === View.TIP && (
                    <WorkoutTip activityType={selectedActivityType} />
                )}

                {currentView === View.PLANS && (
                    <WorkoutPlans 
                        plans={workoutPlans} 
                        addPlan={addPlan} 
                        deletePlan={deletePlan} 
                    />
                )}

                {currentView === View.WEIGHT && (
                    <BodyWeightTracker
                        history={bodyWeightHistory}
                        addEntry={addBodyWeightEntry}
                    />
                )}

            </main>
            <BottomNavBar currentView={currentView} setCurrentView={setCurrentView} />

            {/* Floating Action Button to switch to Log view */}
            {![View.LOG, View.PLANS, View.WEIGHT].includes(currentView) && (
                <button
                    onClick={() => setCurrentView(View.LOG)}
                    className="fixed bottom-20 right-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 z-50"
                    aria-label="Log new activity"
                >
                    <PlusIcon className="h-8 w-8" />
                </button>
            )}
        </div>
    );
};

export default App;
