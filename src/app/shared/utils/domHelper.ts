export function focusNext(current: Element): void {
	/*
		I was trying to use this in response to pressing enter on a 
		certain control. But for reasons, I don't quite understand
		the keypress event is apparently something you can get caught in the
		middle of so it was firing the keypress action for the next control
		after it had been focused. So, we're using setTimeout here
		to toss our work to the end of the queue so we focus, after the
		key event is well and over with

		#bug: explicit tab order is ignored
	*/
	setTimeout(() => {
		const selectors = 'input, [tabindex], button, select, textarea';
		const nodes = document.querySelectorAll(selectors);
		//go back to first element
		if(current === nodes[nodes.length -1]) {
			const node = nodes[0] as HTMLElement;
			//the disabled part is not fully tested
			if(node.tabIndex !== -1 || !node.attributes['disabled']) {
				node.focus();
				return;
			}
		}
		let idx = 0;
		for(; idx < nodes.length; idx++) {
			if(nodes[idx] === current) break;
		}
		idx++;
		for(; idx < nodes.length; idx++) {
			const node = nodes[idx] as HTMLElement;
			//the disabled part is not fully tested
			if(node.tabIndex === -1 || node.attributes['disabled']) {
				continue;
			}
			node.focus();
			break;
		}
	});
}

export function nodeFirst(nodes: NodeList): Node {
	if(!nodes || nodes.length < 1) return null;
	return nodes[0];
}