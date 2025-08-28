import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format date
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date for input
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get date range for common filters
export const getDateRanges = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);
  
  return {
    today: {
      from: formatDateForInput(today),
      to: formatDateForInput(today),
      label: 'Today'
    },
    yesterday: {
      from: formatDateForInput(yesterday),
      to: formatDateForInput(yesterday),
      label: 'Yesterday'
    },
    lastWeek: {
      from: formatDateForInput(lastWeek),
      to: formatDateForInput(today),
      label: 'Last 7 days'
    },
    lastMonth: {
      from: formatDateForInput(lastMonth),
      to: formatDateForInput(today),
      label: 'Last 30 days'
    },
    lastYear: {
      from: formatDateForInput(lastYear),
      to: formatDateForInput(today),
      label: 'Last year'
    }
  };
};

// Validate file type
export const isValidCSVFile = (file: File): boolean => {
  return file.type === 'text/csv' || file.name.endsWith('.csv');
};

// File size validation (max 10MB)
export const isValidFileSize = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
};