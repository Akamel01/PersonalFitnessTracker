
import React, { useState, useCallback } from 'react';
import { ActivityType } from '../types';
import { getWorkoutTip } from '../services/geminiService';

interface Props {
    activityType: ActivityType;
}

const WorkoutTip: React.FC<Props> = ({ activityType }) => {
    const [tip, setTip] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTip = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setTip('');
        try {
            const result = await getWorkoutTip(activityType);
            setTip(result);
        } catch (err) {
            setError('Failed to fetch tip. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [activityType]);
    
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-center">
                 <i className="fa-solid fa-lightbulb text-yellow-400 text-3xl mb-3"></i>
                <h2 className="text-2xl font-bold text-white mb-2">AI Workout Coach</h2>
                <p className="text-gray-400 mb-4">Get a personalized tip for your <span className="font-semibold text-indigo-400">{activityType}</span> workout.</p>
                <button
                    onClick={fetchTip}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:bg-indigo-800 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            Getting Tip...
                        </>
                    ) : (
                        'Generate Tip'
                    )}
                </button>
            </div>

            {error && <p className="mt-4 text-center text-red-400">{error}</p>}

            {tip && (
                <div className="mt-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                    <p className="text-gray-200 whitespace-pre-wrap font-serif text-lg leading-relaxed">{tip}</p>
                </div>
            )}
        </div>
    );
};

export default WorkoutTip;
