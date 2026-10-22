export interface Habit {
  id: string;
  title: string;
  icon: string;
  createdAt: string; // YYYY-MM-DD
  completedDates: string[]; // List of YYYY-MM-DD strings
  color?: string;
}

export interface DayOverviewStats {
  totalHabits: number;
  completedTodayCount: number;
  percentage: number;
}

export interface HabitFormData {
  title: string;
  icon: string;
}
