import { TouchedTimestamp } from 'src/app/types/IdSelectable';

export function swap(array: any[], idx0: number, idx1: number): boolean {
	if(idx0 < array.length && idx1 < array.length && idx0 >= 0 && idx1 >= 0) {
		const tmp = array[idx0];
		array[idx0] = array[idx1];
		array[idx1] = tmp;
		return true;
	}
	return false;
}

export function asArray<T>(value: T | T[]): T[] {
	if(value === null || value === undefined) return [];
	if(Array.isArray(value)) return value as unknown as T[];
	return [value];
}

export function first<T>(value: T[]): T | null {
	if(value === null || value === undefined) return null;
	if(value.length > 0) return value[0];
	return null;
}

export function last<T>(value: T[]): T | null {
	if(value === null || value === undefined) return null;
	if(value.length > 0) return value[value.length - 1];
	return null;
}

export function getLatest<T extends TouchedTimestamp>(value: T[]): T | null {
	if(value === null || value === undefined) return null;
	if(value.length > 0) { 
		return value.reduce((a, v) => v.lastUpdated > a.lastUpdated ? v : a)
	}
	return null;
}