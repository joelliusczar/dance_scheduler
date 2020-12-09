
export function stripDownObj(obj: Object, shallowPaths: string[]): 
	Object | null 
{
	if(!obj) return null;
	const copy = {...obj};
	for(const key of shallowPaths) {
		delete copy[key];
	}
	return Object.keys(copy).length ? copy : null;
}
