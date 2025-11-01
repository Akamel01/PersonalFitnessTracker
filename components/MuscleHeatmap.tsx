import React from 'react';
import { MuscleGroup } from '../types';

interface Props {
    volumeData: { [key in MuscleGroup]?: number };
}

// Map app's MuscleGroup enum to SVG element IDs
const muscleIdMap: { [key in MuscleGroup]?: string[] } = {
    [MuscleGroup.SHOULDERS]: ['deltoids_anterior', 'deltoids_posterior'],
    [MuscleGroup.CHEST]: ['pectorals'],
    [MuscleGroup.BACK]: ['trapezius', 'lats', 'termajor'],
    [MuscleGroup.BICEPS]: ['biceps'],
    [MuscleGroup.TRICEPS]: ['triceps'],
    [MuscleGroup.ABS]: ['abs'],
    [MuscleGroup.QUADS]: ['quads'],
    [MuscleGroup.HAMSTRINGS]: ['hamstrings'],
    [MuscleGroup.GLUTES]: ['glutes'],
    [MuscleGroup.CALVES]: ['calves_posterior'],
    [MuscleGroup.FOREARMS]: ['forearms_anterior', 'forearms_posterior'],
};

const MuscleHeatmap: React.FC<Props> = ({ volumeData }) => {
    
    const maxVolume = Math.max(1, ...Object.values(volumeData).filter(v => v !== undefined) as number[]);

    const getColor = (volume: number | undefined) => {
        if (volume === undefined || volume <= 0) return 'rgba(255, 255, 255, 0.1)'; // Base color for no volume
        const ratio = Math.min(volume / maxVolume, 1);

        // A scale from light blue -> green -> yellow -> red
        if (ratio < 0.25) return '#818cf8'; // Indigo-400
        if (ratio < 0.5) return '#60a5fa'; // Blue-400
        if (ratio < 0.75) return '#facc15'; // Yellow-400
        return '#ef4444'; // Red-500
    };

    const aggregatedMuscleStyles: { [id: string]: { fill: string, volume: number } } = {};

    Object.entries(volumeData).forEach(([muscle, volume]) => {
        const ids = muscleIdMap[muscle as MuscleGroup];
        // FIX: Use 'typeof volume === 'number'' as a type guard to correctly narrow the type of 'volume'.
        if (ids && typeof volume === 'number') {
            ids.forEach(id => {
                aggregatedMuscleStyles[id] = { fill: getColor(volume), volume };
            });
        }
    });

    return (
        <div className="w-full flex justify-center items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 600"
                className="max-w-sm"
                aria-labelledby="heatmap-title"
                role="img"
            >
                <title id="heatmap-title">Muscle Engagement Heatmap</title>
                <style>
                    {`.muscle-path { fill: rgba(255, 255, 255, 0.1); stroke: #4a5568; stroke-width: 0.5; transition: fill 0.3s ease; }`}
                </style>
                <g id="figure-anterior">
                    <path className="muscle-path" id="deltoids_anterior" style={{ fill: aggregatedMuscleStyles.deltoids_anterior?.fill }} d="M149,150 a25,20 0 0,1 50,0 v15 l-50,15z">
                         <title>Shoulders: {aggregatedMuscleStyles.deltoids_anterior?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="pectorals" style={{ fill: aggregatedMuscleStyles.pectorals?.fill }} d="M155,165 h40 l-5,40 h-30z">
                        <title>Chest: {aggregatedMuscleStyles.pectorals?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="biceps" style={{ fill: aggregatedMuscleStyles.biceps?.fill }} d="M135,175 l-10,50 h10z">
                         <title>Biceps: {aggregatedMuscleStyles.biceps?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="forearms_anterior" style={{ fill: aggregatedMuscleStyles.forearms_anterior?.fill }} d="M125,225 l10,60 h-10z">
                         <title>Forearms: {aggregatedMuscleStyles.forearms_anterior?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="abs" style={{ fill: aggregatedMuscleStyles.abs?.fill }} d="M160,205 h30 v60 h-30z">
                        <title>Abs: {aggregatedMuscleStyles.abs?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="quads" style={{ fill: aggregatedMuscleStyles.quads?.fill }} d="M150,270 l-10,120 h20 l10,-120 h-20z M190,270 l-10,120 h20 l10,-120 h-20z">
                        <title>Quads: {aggregatedMuscleStyles.quads?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                </g>

                <g id="figure-posterior" transform="translate(250, 0)">
                    <path className="muscle-path" id="deltoids_posterior" style={{ fill: aggregatedMuscleStyles.deltoids_posterior?.fill }} d="M99,150 a25,20 0 0,0 50,0 v15 l-50,15z">
                        <title>Shoulders: {aggregatedMuscleStyles.deltoids_posterior?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="trapezius" style={{ fill: aggregatedMuscleStyles.trapezius?.fill }} d="M105,150 l20,-10 h20 l20,10 v20 h-60z">
                        <title>Back (Traps): {aggregatedMuscleStyles.trapezius?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="lats" style={{ fill: aggregatedMuscleStyles.lats?.fill }} d="M100,170 l-10,70 h80 l-10,-70z">
                        <title>Back (Lats): {aggregatedMuscleStyles.lats?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                     <path className="muscle-path" id="termajor" style={{ fill: aggregatedMuscleStyles.termajor?.fill }} d="M105,170 h40 v20 h-40z">
                        <title>Back (Teres): {aggregatedMuscleStyles.termajor?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="triceps" style={{ fill: aggregatedMuscleStyles.triceps?.fill }} d="M85,175 l-10,50 h10z">
                         <title>Triceps: {aggregatedMuscleStyles.triceps?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="forearms_posterior" style={{ fill: aggregatedMuscleStyles.forearms_posterior?.fill }} d="M75,225 l10,60 h-10z">
                         <title>Forearms: {aggregatedMuscleStyles.forearms_posterior?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="glutes" style={{ fill: aggregatedMuscleStyles.glutes?.fill }} d="M95,240 h60 v40 h-60z">
                         <title>Glutes: {aggregatedMuscleStyles.glutes?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="hamstrings" style={{ fill: aggregatedMuscleStyles.hamstrings?.fill }} d="M100,285 v100 h-5 l5,-100z M145,285 v100 h5 l-5,-100z">
                         <title>Hamstrings: {aggregatedMuscleStyles.hamstrings?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                    <path className="muscle-path" id="calves_posterior" style={{ fill: aggregatedMuscleStyles.calves_posterior?.fill }} d="M100,390 a10,20 0 0,1 20,0 v30 h-20z M130,390 a10,20 0 0,1 20,0 v30 h-20z">
                        <title>Calves: {aggregatedMuscleStyles.calves_posterior?.volume?.toFixed(0) ?? 0} kg</title>
                    </path>
                </g>
            </svg>
        </div>
    );
};

export default MuscleHeatmap;