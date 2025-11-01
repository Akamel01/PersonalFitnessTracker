import { MuscleGroup } from '../types';

export interface ExerciseInfo {
    name: string;
    muscleGroups: MuscleGroup[];
}

export const exerciseDictionary: ExerciseInfo[] = [
    // Chest
    { name: 'Bench Press', muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS] },
    { name: 'Incline Bench Press', muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS] },
    { name: 'Decline Bench Press', muscleGroups: [MuscleGroup.CHEST] },
    { name: 'Dumbbell Press', muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS] },
    { name: 'Incline Dumbbell Press', muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS] },
    { name: 'Push-ups', muscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS] },
    { name: 'Dips', muscleGroups: [MuscleGroup.CHEST, MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS] },
    { name: 'Cable Fly', muscleGroups: [MuscleGroup.CHEST] },
    { name: 'Dumbbell Fly', muscleGroups: [MuscleGroup.CHEST] },

    // Back
    { name: 'Pull-ups', muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS] },
    { name: 'Chin-ups', muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS] },
    { name: 'Lat Pulldown', muscleGroups: [MuscleGroup.BACK] },
    { name: 'Bent Over Row', muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS] },
    { name: 'T-Bar Row', muscleGroups: [MuscleGroup.BACK] },
    { name: 'Seated Cable Row', muscleGroups: [MuscleGroup.BACK, MuscleGroup.BICEPS] },
    { name: 'Deadlift', muscleGroups: [MuscleGroup.BACK, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS] },
    { name: 'Romanian Deadlift', muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.BACK] },

    // Shoulders
    { name: 'Overhead Press', muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS] },
    { name: 'Arnold Press', muscleGroups: [MuscleGroup.SHOULDERS] },
    { name: 'Lateral Raise', muscleGroups: [MuscleGroup.SHOULDERS] },
    { name: 'Front Raise', muscleGroups: [MuscleGroup.SHOULDERS] },
    { name: 'Rear Delt Fly', muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK] },
    { name: 'Face Pulls', muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.BACK] },
    { name: 'Upright Row', muscleGroups: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS] },

    // Legs
    { name: 'Squat', muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS] },
    { name: 'Front Squat', muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES] },
    { name: 'Leg Press', muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES] },
    { name: 'Lunge', muscleGroups: [MuscleGroup.QUADS, MuscleGroup.GLUTES] },
    { name: 'Leg Extension', muscleGroups: [MuscleGroup.QUADS] },
    { name: 'Leg Curl', muscleGroups: [MuscleGroup.HAMSTRINGS] },
    { name: 'Good Mornings', muscleGroups: [MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES] },
    { name: 'Calf Raise', muscleGroups: [MuscleGroup.CALVES] },
    { name: 'Hip Thrust', muscleGroups: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS] },

    // Arms
    { name: 'Bicep Curl', muscleGroups: [MuscleGroup.BICEPS] },
    { name: 'Hammer Curl', muscleGroups: [MuscleGroup.BICEPS, MuscleGroup.FOREARMS] },
    { name: 'Preacher Curl', muscleGroups: [MuscleGroup.BICEPS] },
    { name: 'Triceps Pushdown', muscleGroups: [MuscleGroup.TRICEPS] },
    { name: 'Skull Crushers', muscleGroups: [MuscleGroup.TRICEPS] },
    { name: 'Overhead Triceps Extension', muscleGroups: [MuscleGroup.TRICEPS] },
    { name: 'Close Grip Bench Press', muscleGroups: [MuscleGroup.TRICEPS, MuscleGroup.CHEST] },
    { name: 'Wrist Curl', muscleGroups: [MuscleGroup.FOREARMS] },

    // Abs
    { name: 'Crunches', muscleGroups: [MuscleGroup.ABS] },
    { name: 'Leg Raises', muscleGroups: [MuscleGroup.ABS] },
    { name: 'Plank', muscleGroups: [MuscleGroup.ABS] },
    { name: 'Russian Twist', muscleGroups: [MuscleGroup.ABS] },
    { name: 'Cable Crunch', muscleGroups: [MuscleGroup.ABS] },
];
