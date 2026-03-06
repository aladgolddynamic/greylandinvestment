import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay in milliseconds.
 * Prevents expensive re-renders on rapid input changes (e.g. search boxes).
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
