export function isAValue(value: any): Boolean {
	return value !== null && value != undefined;
}

export function isEmptyStr(value: any): boolean {
	if(value === null || value === undefined) return true;
	if(typeof value === 'string') {
		return value.length === 0;
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