import React, { useState } from 'react';
import { Activity, ActivityType, WeightLiftingLog, SwimmingLog, RunningLog, SetLog } from '../types';

interface Props {
    activities: Activity[];
    deleteActivity: (id: string) => void;
}

const ActivityCard: React.FC<{ activity: Activity, onDelete: (id: string) => void }> = ({ activity, onDelete }) => {
    const renderDetails = () => {
        switch (activity.type) {
            case ActivityType.WEIGHT_LIFTING:
                const wl = activity as WeightLiftingLog;
                const totalVolume = wl.sets.reduce((sum, set) => sum + set.reps * set.weight, 0);
                return (
                    <>
                        <h3 className="text-lg font-bold text-white">{wl.exercise}</h3>
                        {wl.workoutPlanName && <p className="text-xs text-indigo-400 mb-2">{wl.workoutPlanName}</p>}
                        <div className="space-y-1 text-sm mt-2">
                            {wl.sets.map((set: SetLog, index: number) => (
                                <div key={index} className="flex justify-between items-center bg-gray-700/50 px-3 py-1 rounded">
                                    <span className="text-gray-400 font-mono text-xs">SET {index + 1}</span>
                                    <span className="font-semibold text-gray-200">{set.reps} reps</span>
                                    <span className="text-gray-400">@</span>
                                    <span className="font-semibold text-gray-200">{set.weight} kg</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-right mt-3 text-xs text-gray-400">
                            Total Volume: <span className="font-bold text-indigo-300">{totalVolume.toFixed(2)} kg</span>
                        </div>
                    </>
                );
            case ActivityType.SWIMMING:
                const sl = activity as SwimmingLog;
                return (
                    <>
                        <h3 className="text-lg font-bold text-white">Swimming</h3>
                        <div className="flex justify-around mt-2 text-center">
                            <div><p className="text-xs text-gray-400">Distance</p><p className="font-semibold text-indigo-300">{sl.distance} m</p></div>
                            <div><p className="text-xs text-gray-400">Time</p><p className="font-semibold text-indigo-300">{sl.duration} min</p></div>
                            <div><p className="text-xs text-gray-400">Laps</p><p className="font-semibold text-indigo-300">{sl.laps}</p></div>
                        </div>
                    </>
                );
            case ActivityType.RUNNING:
                const rl = activity as RunningLog;
                 const pace = rl.duration > 0 ? (rl.duration / rl.distance).toFixed(2) : 0;
                return (
                    <>
                        <h3 className="text-lg font-bold text-white">Running</h3>
                        <div className="flex justify-around mt-2 text-center">
                            <div><p className="text-xs text-gray-400">Distance</p><p className="font-semibold text-indigo-300">{rl.distance.toFixed(2)} km</p></div>
                            <div><p className="text-xs text-gray-400">Time</p><p className="font-semibold text-indigo-300">{rl.duration} min</p></div>
                            <div><p className="text-xs text-gray-400">Pace</p><p className="font-semibold text-indigo-300">{pace} min/km</p></div>
                        </div>
                    </>
                );
        }
    };
    
    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-4 relative">
            {renderDetails()}
            <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-700">
                {new Date(activity.date).toLocaleString()}
            </div>
            <button onClick={() => onDelete(activity.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
    );
};


const ActivityHistory: React.FC<Props> = ({ activities, deleteActivity }) => {
    const [filter, setFilter] = useState<ActivityType | 'ALL'>('ALL');
    
    const filteredActivities = activities.filter(a => filter === 'ALL' || a.type === filter);
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Workout History</h2>
            
            <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
                <button onClick={() => setFilter('ALL')} className={`w-full py-2 text-sm font-medium rounded-md ${filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}>All</button>
                {Object.values(ActivityType).map(type => (
                    <button key={type} onClick={() => setFilter(type)} className={`w-full py-2 text-sm font-medium rounded-md ${filter === type ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}>{type}</button>
                ))}
            </div>

            {filteredActivities.length > 0 ? (
                <div className="space-y-4">
                    {filteredActivities.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} onDelete={deleteActivity} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No activities logged yet.</p>
                    <p className="text-gray-500 text-sm">Start by logging a new workout!</p>
                </div>
            )}
        </div>
    );
};

export default ActivityHistory;
