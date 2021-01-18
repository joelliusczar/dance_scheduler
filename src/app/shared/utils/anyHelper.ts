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
