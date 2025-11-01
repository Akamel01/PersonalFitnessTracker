
import React, { useState } from 'react';
import { SwimmingLog } from '../types';

interface Props {
    addActivity: (log: Omit<SwimmingLog, 'id' | 'date' | 'type'>) => void;
}

const SwimmingForm: React.FC<Props> = ({ addActivity }) => {
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [laps, setLaps] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!distance || !duration || !laps) return;

        addActivity({
            distance: parseFloat(distance),
            duration: parseInt(duration),
            laps: parseInt(laps),
        });

        setDistance('');
        setDuration('');
        setLaps('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label htmlFor="distance" className="block text-sm font-medium text-gray-400">Distance (m)</label>
                    <input type="number" id="distance" value={distance} onChange={e => setDistance(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="0" required />
                </div>
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-400">Time (min)</label>
                    <input type="number" id="duration" value={duration} onChange={e => setDuration(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="1" required />
                </div>
                <div>
                    <label htmlFor="laps" className="block text-sm font-medium text-gray-400">Laps</label>
                    <input type="number" id="laps" value={laps} onChange={e => setLaps(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="1" required />
                </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                Log Swim
            </button>
        </form>
    );
};

export default SwimmingForm;
