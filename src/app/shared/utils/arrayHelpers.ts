import { TouchedTimestamp } from 'src/app/types/touch-timestamp';

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

export function getLatestIdx<T extends TouchedTimestamp>(value: T[]): number {
	if(value === null || value === undefined) return -1;
	if(value.length > 0) { 
		return value.reduce((a, _, i, arr) => 
			arr[i].lastUpdated > arr[a].lastUpdated ? i : a, 0);
	}
	return -1;
}

export function getLatest<T extends TouchedTimestamp>(value: T[]): T | null {
	const idx = getLatestIdx(value);
	return idx > -1 ? value[idx] : null;
}

export function immutableReplace<T>(arr: T[], value: T, idx: number): T[] {
	if(arr === null || arr === undefined) return null;
	const replacement = [...arr];
	replacement[idx] = value;
	return replacement;
}