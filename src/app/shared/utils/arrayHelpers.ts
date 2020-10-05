export function swap(array: any[], idx0: number, idx1: number): boolean {
	if(idx0 < array.length && idx1 < array.length && idx0 >= 0 && idx1 >= 0) {
		const tmp = array[idx0];
		array[idx0] = array[idx1];
		array[idx1] = tmp;
		return true;
	}
	return false;
}