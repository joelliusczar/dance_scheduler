import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elementFilter'
})
export class ElementFilterPipe implements PipeTransform {

	transform(value: NodeList): any {
		if(!value) return [];
		return Array.from(value).filter(e => e.nodeType !== Node.COMMENT_NODE);
	}

}
