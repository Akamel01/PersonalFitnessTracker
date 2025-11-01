export enum ActivityType {
    WEIGHT_LIFTING = 'Weight Lifting',
    SWIMMING = 'Swimming',
    RUNNING = 'Running',
}

export enum View {
    LOG = 'LOG',
    HISTORY = 'HISTORY',
    DASHBOARD = 'DASHBOARD',
    TIP = 'TIP',
    PLANS = 'PLANS',
    WEIGHT = 'WEIGHT',
}

export enum MuscleGroup {
    CHEST = 'Chest',
    BACK = 'Back',
    SHOULDERS = 'Shoulders',
    BICEPS = 'Biceps',
    TRICEPS = 'Triceps',
    LEGS = 'Legs', // Can be broken down further
    QUADS = 'Quads',
    HAMSTRINGS = 'Hamstrings',
    GLUTES = 'Glutes',
    CALVES = 'Calves',
    ABS = 'Abs',
    FOREARMS = 'Forearms',
}


interface BaseActivity {
    id: string;
    type: ActivityType;
    date: string;
}

export interface SetLog {
    reps: number;
    weight: number;
}

export interface WeightLiftingLog extends BaseActivity {
    type: ActivityType.WEIGHT_LIFTING;
    exercise: string;
    sets: SetLog[];
    workoutPlanId?: string;
    workoutPlanName?: string;
}

export interface SwimmingLog extends BaseActivity {
    type: ActivityType.SWIMMING;
    distance: number; // in meters
    duration: number; // in minutes
    laps: number;
}

export interface RunningLog extends BaseActivity {
    type: ActivityType.RUNNING;
    distance: number; // in kilometers
    duration: number; // in minutes
}

export type Activity = WeightLiftingLog | SwimmingLog | RunningLog;

export type ActivityLog = Omit<Activity, 'id' | 'date' | 'type'>;

// For Workout Plans
export interface PlanExercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
}

export interface WorkoutPlan {
    id: string;
    name: string;
    exercises: PlanExercise[];
}

// For Body Weight Tracking
export interface BodyWeightEntry {
    id: string;
    weight: number;
    date: string;
}
