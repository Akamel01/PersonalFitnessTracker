import React, { useMemo, useState } from 'react';
import { Activity, ActivityType, WeightLiftingLog, RunningLog, SwimmingLog, MuscleGroup } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// FIX: Use subpath imports for date-fns to resolve module export errors.
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import startOfISOWeek from 'date-fns/startOfISOWeek';
import subDays from 'date-fns/subDays';
import { exerciseDictionary } from '../data/exercises';
import MuscleHeatmap from './MuscleHeatmap';

interface Props {
    activities: Activity[];
}

const Dashboard: React.FC<Props> = ({ activities }) => {
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    
    const weightLiftingActivities = useMemo(() => 
        activities.filter(a => a.type === ActivityType.WEIGHT_LIFTING) as WeightLiftingLog[], 
        [activities]
    );

    const weeklyMuscleVolume = useMemo(() => {
        const last7Days = subDays(new Date(), 7);
        const recentActivities = weightLiftingActivities.filter(a => parseISO(a.date) >= last7Days);
        
        const volumeByMuscle: { [key in MuscleGroup]?: number } = {};

        recentActivities.forEach(activity => {
            const exerciseInfo = exerciseDictionary.find(ex => ex.name.toLowerCase() === activity.exercise.toLowerCase());
            if (exerciseInfo) {
                const totalVolume = activity.sets.reduce((sum, set) => sum + set.reps * set.weight, 0);
                exerciseInfo.muscleGroups.forEach(muscle => {
                    if (!volumeByMuscle[muscle]) {
                        volumeByMuscle[muscle] = 0;
                    }
                    volumeByMuscle[muscle]! += totalVolume;
                });
            }
        });
        return volumeByMuscle;
    }, [weightLiftingActivities]);

    const maxWeightProgression = useMemo(() => {
        if (!selectedExercise) return [];
        return weightLiftingActivities
            .filter(a => a.exercise === selectedExercise)
            .map(a => ({
                date: format(parseISO(a.date), 'MMM d'),
                maxWeight: Math.max(...a.sets.map(s => s.weight)),
            }))
             .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [weightLiftingActivities, selectedExercise]);
    
    const uniqueExercises = useMemo(() => {
        const exerciseSet = new Set(weightLiftingActivities.map(a => a.exercise));
        return Array.from(exerciseSet).sort();
    }, [weightLiftingActivities]);

    // Effect to select the first exercise by default
    React.useEffect(() => {
        if (uniqueExercises.length > 0 && !selectedExercise) {
            setSelectedExercise(uniqueExercises[0]);
        }
    }, [uniqueExercises, selectedExercise]);


    const liftingData = useMemo(() => {
        const dataByDate = weightLiftingActivities.reduce((acc, curr) => {
            const date = format(parseISO(curr.date), 'MMM d');
            const volume = curr.sets.reduce((total, set) => total + (set.reps * set.weight), 0);
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += volume;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(dataByDate)
            .map(([date, volume]) => ({ date, volume }))
            .reverse();

    }, [weightLiftingActivities]);

    const runningData = useMemo(() => {
        const runningActivities = activities
            .filter(a => a.type === ActivityType.RUNNING) as RunningLog[];

        return runningActivities
            .map(act => {
                const pace = act.duration > 0 ? (act.duration / act.distance) : 0;
                return {
                    date: format(parseISO(act.date), 'MMM d'),
                    distance: act.distance,
                    pace: pace
                };
            })
            .reverse();
    }, [activities]);

    const swimmingData = useMemo(() => {
        const swimmingActivities = activities
            .filter(a => a.type === ActivityType.SWIMMING) as SwimmingLog[];

        const dataByWeek = swimmingActivities.reduce((acc, curr) => {
            // FIX: Use startOfISOWeek as suggested by the error message.
            const weekStart = format(startOfISOWeek(parseISO(curr.date)), 'MMM d');
            if (!acc[weekStart]) {
                acc[weekStart] = 0;
            }
            acc[weekStart] += curr.distance;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(dataByWeek)
            .map(([week, distance]) => ({ week, distance }))
             .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    }, [activities]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-700 p-2 border border-gray-600 rounded">
                    <p className="label text-white">{`${label}`}</p>
                    {payload.map((p: any, index: number) => (
                        <p key={index} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(2)}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };
    
    if (activities.length === 0) {
        return (
             <div className="text-center py-20 bg-gray-800 rounded-lg">
                <i className="fas fa-chart-pie text-4xl text-gray-500 mb-4"></i>
                <h2 className="text-xl font-bold text-white">Dashboard is Empty</h2>
                <p className="text-gray-400">Log some activities to see your progress here!</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Your Progress</h2>
            
             {weightLiftingActivities.length > 0 && (
                 <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">Muscle Engagement (Last 7 Days)</h3>
                     <MuscleHeatmap volumeData={weeklyMuscleVolume} />
                 </div>
            )}

            {maxWeightProgression.length > 0 && (
                 <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-purple-300">Max Weight Progression</h3>
                    <select value={selectedExercise} onChange={e => setSelectedExercise(e.target.value)}
                        className="mb-4 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        {uniqueExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                    </select>
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={maxWeightProgression} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="date" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="maxWeight" stroke="#c084fc" name="Max Weight (kg)" />
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
            )}
            
            {liftingData.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-300">Weight Lifting Volume (kg)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={liftingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="date" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="volume" fill="#818cf8" name="Total Volume" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
            
            {runningData.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-green-300">Running Progress</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={runningData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="date" stroke="#a0aec0" />
                            <YAxis yAxisId="left" stroke="#6ee7b7" label={{ value: 'km', angle: -90, position: 'insideLeft', fill: '#6ee7b7' }}/>
                             <YAxis yAxisId="right" orientation="right" stroke="#fde047" label={{ value: 'min/km', angle: 90, position: 'insideRight', fill: '#fde047' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="distance" stroke="#6ee7b7" name="Distance (km)" />
                            <Line yAxisId="right" type="monotone" dataKey="pace" stroke="#fde047" name="Pace (min/km)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {swimmingData.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Weekly Swimming Distance (m)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={swimmingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="week" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="distance" fill="#93c5fd" name="Distance (m)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Dashboard;