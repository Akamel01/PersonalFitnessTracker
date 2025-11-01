
import React, { useState } from 'react';
import { RunningLog } from '../types';

interface Props {
    addActivity: (log: Omit<RunningLog, 'id' | 'date' | 'type'>) => void;
}

const RunningForm: React.FC<Props> = ({ addActivity }) => {
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!distance || !duration) return;

        addActivity({
            distance: parseFloat(distance),
            duration: parseInt(duration),
        });

        setDistance('');
        setDuration('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="distance" className="block text-sm font-medium text-gray-400">Distance (km)</label>
                    <input type="number" id="distance" value={distance} onChange={e => setDistance(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="0" step="0.1" required />
                </div>
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-400">Time (min)</label>
                    <input type="number" id="duration" value={duration} onChange={e => setDuration(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="1" required />
                </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                Log Run
            </button>
        </form>
    );
};

export default RunningForm;
