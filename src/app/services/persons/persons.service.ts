import { Injectable } from '@angular/core';
import { Person, PersonDto } from 'src/app/types/data-shape';
import { BrowserDbService, PEOPLE_TABLE_NAME } 
	from '../browser-Db/browser-db.service';
import { ListService } from '../list/list.service';
import { SchoolsService } from '../schools/schools.service';

@Injectable({
  providedIn: 'root'
})
export class PersonsService extends ListService<Person, PersonDto>{

	tableName = PEOPLE_TABLE_NAME;

	constructor(protected browserDb: BrowserDbService,  
		private schoolsService: SchoolsService) 
	{ 
		super(browserDb);
	}

	async transform(person: Person): Promise<PersonDto> {
		const school = await this.schoolsService.getItemById(person.schoolId);
		return {...person, school: school };
	}

	transformInverse(dto: PersonDto): Person {
		const { school, ...person} = dto;
		(person as Person).schoolId = school.id;
		return person as Person;
	}
}
