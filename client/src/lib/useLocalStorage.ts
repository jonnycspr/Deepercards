import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export interface UserProgress {
  answeredQuestions: number[];
  savedForLater: number[];
  currentFilters: number[];
  shownQuestionsPerCategory: Record<number, number>;
}

export const defaultProgress: UserProgress = {
  answeredQuestions: [],
  savedForLater: [],
  currentFilters: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  shownQuestionsPerCategory: {},
};
