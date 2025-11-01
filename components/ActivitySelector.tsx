
import React from 'react';
import { ActivityType } from '../types';
import { DumbbellIcon, SwimmerIcon, RunningIcon } from './Icons';

interface ActivitySelectorProps {
    selectedActivity: ActivityType;
    setSelectedActivity: (activity: ActivityType) => void;
}

const activityOptions = [
    { type: ActivityType.WEIGHT_LIFTING, Icon: DumbbellIcon, label: 'Lifting' },
    { type: ActivityType.SWIMMING, Icon: SwimmerIcon, label: 'Swimming' },
    { type: ActivityType.RUNNING, Icon: RunningIcon, label: 'Running' },
];

const ActivitySelector: React.FC<ActivitySelectorProps> = ({ selectedActivity, setSelectedActivity }) => {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Select Activity</h2>
            <div className="grid grid-cols-3 gap-3">
                {activityOptions.map(({ type, Icon, label }) => (
                    <button
                        key={type}
                        onClick={() => setSelectedActivity(type)}
                        className={`
                            flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200
                            ${selectedActivity === type 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'}
                        `}
                    >
                        <Icon className="h-8 w-8 mb-1" />
                        <span className="font-medium text-sm">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ActivitySelector;
