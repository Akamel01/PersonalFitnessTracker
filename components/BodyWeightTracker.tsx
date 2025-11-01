import React, { useState, useMemo } from 'react';
import { BodyWeightEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Use subpath imports for date-fns to resolve module export errors.
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

interface Props {
    history: BodyWeightEntry[];
    addEntry: (entry: { weight: number }) => void;
}

const BodyWeightTracker: React.FC<Props> = ({ history, addEntry }) => {
    const [weight, setWeight] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!weight) return;
        addEntry({ weight: parseFloat(weight) });
        setWeight('');
    };
    
    const chartData = useMemo(() => {
        return history
            .map(entry => ({
                date: format(parseISO(entry.date), 'MMM d'),
                weight: entry.weight,
            }))
            .reverse();
    }, [history]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-700 p-2 border border-gray-600 rounded">
                    <p className="label text-white">{`${label}`}</p>
                    <p style={{ color: '#818cf8' }}>{`Weight: ${payload[0].value.toFixed(1)} kg`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Body Weight</h2>

            <div className="bg-gray-800 p-4 rounded-lg">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input type="number" placeholder="Current Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)}
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" step="0.1" required />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">Log Weight</button>
                </form>
            </div>
            
            {history.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                     <h3 className="text-xl font-semibold mb-4 text-indigo-300">Weight Trend</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                             <XAxis dataKey="date" stroke="#a0aec0" />
                             <YAxis stroke="#a0aec0" domain={['dataMin - 2', 'dataMax + 2']}/>
                             <Tooltip content={<CustomTooltip />} />
                             <Legend />
                             <Line type="monotone" dataKey="weight" stroke="#818cf8" name="Weight (kg)" />
                        </LineChart>
                     </ResponsiveContainer>
                </div>
            )}
            
            {history.length > 0 ? (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-300">Recent Logs</h3>
                    {history.slice(0, 10).map(entry => (
                        <div key={entry.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-md">
                            <span className="font-bold text-white">{entry.weight.toFixed(1)} kg</span>
                            <span className="text-sm text-gray-400">{new Date(entry.date).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No weight entries yet.</p>
                </div>
            )}
        </div>
    );
};

export default BodyWeightTracker;