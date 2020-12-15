export function focusNext(current: Element): void {
	setTimeout(() => {
		const selectors = 'input, [tabindex], button, select, textarea'
		const nodes = document.querySelectorAll(selectors);
		console.log(nodes);
		console.log(current);
		let idx = 0;
		for(; idx < nodes.length; idx++) {
			if(nodes[idx] === current) {
				idx++;
				break;
			}
		}
		for(; idx < nodes.length; idx++) {
			const node = nodes[idx] as HTMLElement;
			if(node.tabIndex === -1 || node.attributes['disabled']) {
				continue;
			}
			console.log('go focus');
			console.log(node);
			node.focus();
			break;
		}
	});
}