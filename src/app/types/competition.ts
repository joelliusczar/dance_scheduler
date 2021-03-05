import { DataKey } from './data-key';
import { AgeGroupType, 
	Category, 
	Dance, 
	Dancer, 
	Heat, 
	MultiDance, 
	Person, 
	SkillLevel } from './data-shape';
import { SocialEvent } from './social-event';
import { v4 } from 'uuid';

export class Competition implements SocialEvent {
	eventDate: Date = null;
	id: DataKey = v4();
	name: string = '';
	lastUpdated: Date = new Date();
	createDate: Date = new Date();
	ageGroups: AgeGroupType[] = [];
	multiEventAgeGroups: AgeGroupType[] = [];
	categories: Category[] = [];
	dances: Dance[] = [];
	multiDances: MultiDance[] = [];
	skillLevels: SkillLevel[] = [];
	multiEventSkillLevels: SkillLevel[] = [];
	dancers: Dancer[] = [];
	heats: Heat[] = [];
	judges: Person[] = [];
	finished: boolean = false;

	constructor(copyComp?: Competition) {
		if(copyComp) {
			this._copyCompetition(copyComp);
		}
	}

	private _copyCompetition(copyComp: Competition) {
		this.eventDate = copyComp.eventDate;
		this.name = copyComp.name;
		this.lastUpdated = new Date();
		this.ageGroups = copyComp.ageGroups.map(g => ({...g, id: v4()}));
		this.multiEventAgeGroups = copyComp.multiEventAgeGroups
			.map(g => ({...g, id: v4()}));
		const catMap = new Map<DataKey, Category>(copyComp
				.categories.map(c => [c.id, {...c, id: v4()}]));
		this.categories = Array.from(catMap.values());
		const danceMap = new Map<DataKey, Dance>(copyComp
			.dances.map(d => [d.id, {...d, id: v4()}]));
		danceMap.forEach((value) => {
			value.categoryId = catMap.get(value.categoryId).id;
			value.linkedDanceIds = value.linkedDanceIds.map(id => danceMap.get(id).id);
		})
		this.dances = Array.from(danceMap.values());
		this.multiDances = copyComp.multiDances.map(md => {
			const copy = {...md, id: v4()};
			copy.categoryId = catMap.get(copy.categoryId).id;
			copy.linkedDanceIds = copy.linkedDanceIds.map(id => danceMap.get(id).id);
			return copy;
		});
		this.skillLevels = copyComp.skillLevels.map(s => ({...s, id: v4()}));
		this.multiEventSkillLevels = copyComp
			.multiEventSkillLevels.map(s => ({...s, id: v4()}));
	}

	static defaultCompetition(): Competition {
		const competition = new Competition();
		let order = 0;
		competition.ageGroups = [{
			id: v4(),
			name: 'Jr',
			fromAge: 13,
			toAge: 17,
			order: order++
		},
		{
			id: v4(),
			name: 'A1',
			fromAge: 18,
			toAge: 34,
			order: order++
		},
		{
			id: v4(),
			name: 'A2',
			fromAge: 35,
			toAge: 49,
			order: order++
		},
		{
			id: v4(),
			name: 'B1',
			fromAge: 50,
			toAge: 59,
			order: order++
		},
		{
			id: v4(),
			name: 'B2',
			fromAge: 60,
			toAge: 69,
			order: order++
		},
		{
			id: v4(),
			name: 'SR1',
			fromAge: 70,
			toAge: 79,
			order: order++
		},
		{
			id: v4(),
			name: 'SR2',
			fromAge: 80,
			toAge: '+',
			order: order++
		}];

		order = 0;
		const smooth: Category = { id: v4(), name: 'Smooth', order: order++};
		const rhythm: Category = { id: v4(), name: 'Rhythm', order: order++};
		const standard: Category = { id: v4(), name: 'Standard', order: order++};
		const latin: Category = { id: v4(), name: 'Latin', order: order++};
		competition.categories = [smooth, rhythm, standard, latin];

		const waltzSmoothId = v4();
		const tangoSmoothId = v4();
		const foxtrotSmoothId = v4();
		const vienneseWaltzSmoothId = v4();
		const chachaRhythmId = v4();
		const rumbaRhythmId = v4();
		const ecsRhythmId = v4();
		const boleroRhythmId = v4();
		const mamboRhythmId = v4();
		const merengueRhythmId = v4();
		const sambaRhythmId = v4();
		const wcsRhythmId = v4();
		const hustleRhythmId = v4();
		const salsaRhythmId = v4();
		const argTangoRhythmId = v4();
		const waltzStandardId = v4();
		const tangoStandardId = v4();
		const vienneseWaltzStandardId = v4();
		const foxtrotStandardId = v4();
		const quickstepStandardId = v4();
		const chachaLatinId = v4();
		const salsaLatinId = v4();
		const rumbaLatinId = v4();
		const pasoDobleLatinId = v4();
		const jiveLatinId = v4();

		order = 0;
		const waltzSmooth: Dance = { id: waltzSmoothId,
			name: 'Waltz',
			shortName: 'W',
			order: order++,
			categoryId: smooth.id,
			linkedDanceIds: []};
		const tangoSmooth: Dance = { id: tangoSmoothId,
			name: 'Tango',
			shortName: 'T',
			order: order++,
			categoryId: smooth.id,
			linkedDanceIds: []};
		const vienneseWaltzSmooth: Dance = { id: vienneseWaltzSmoothId,
			name: 'Viennese Waltz',
			shortName: 'VW',
			order: order++,
			categoryId: smooth.id,
			linkedDanceIds: []};
		const foxtrotSmooth: Dance = { id: foxtrotSmoothId,
			name: 'Foxtrot',
			shortName: 'F',
			order: order++,
			categoryId: smooth.id,
			linkedDanceIds: []};
		const chachaRhythm: Dance = { id: chachaRhythmId,
			name: 'Cha Cha',
			shortName: 'CC',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: []};
		const rumbaRhythm: Dance = { id: rumbaRhythmId,
			name: 'Rumba',
			shortName: 'R',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: []};
		const ecsRhythm: Dance = { id: ecsRhythmId,
			name: 'East Coast Swing',
			shortName: 'ECS',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: []};
		const boleroRhythm: Dance = { id: boleroRhythmId,
			name: 'Bolero',
			shortName: 'B',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: []};
		const mamboRhythm: Dance = { id: mamboRhythmId,
			name: 'Mambo',
			shortName: 'MAM',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: [ sambaRhythmId ]};
		const merengueRhythm: Dance = { id: merengueRhythmId,
			name: 'Merengue',
			shortName: 'MER',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: []};
		const sambaRhythm: Dance = { id: sambaRhythmId,
			name: 'Samba',
			shortName: 'SAM',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: []};
		const wcsRhythm: Dance = { id: wcsRhythmId,
			name: 'West Coast Swing',
			shortName: 'WCS',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: [ hustleRhythmId ]};
		const hustleRhythm: Dance = { id: hustleRhythmId,
			name: 'Hustle',
			shortName: 'HU',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: [ wcsRhythm.id ]};
		const salsaRhythm: Dance = { id: salsaRhythmId,
			name: 'Salsa',
			shortName: 'SA',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: [ mamboRhythmId ]};
		const argTangoRhythm: Dance = { id: argTangoRhythmId,
			name: 'Argentine Tango',
			shortName: 'AT',
			order: order++,
			categoryId: rhythm.id,
			linkedDanceIds: []};
		const waltzStandard: Dance = { id: waltzStandardId,
			name: 'Waltz',
			shortName: 'W',
			order: order++,
			categoryId: standard.id,
			linkedDanceIds: []};
		const tangoStandard: Dance = { id: tangoStandardId,
			name: 'Tango',
			shortName: 'T',
			order: order++,
			categoryId: standard.id,
			linkedDanceIds: []};
		const vienneseWaltzStandard: Dance = { id: vienneseWaltzStandardId,
			name: 'Viennese Waltz',
			shortName: 'VW',
			order: order++,
			categoryId: standard.id,
			linkedDanceIds: []};
		const foxtrotStandard: Dance = { id: foxtrotStandardId,
			name: 'Foxtrot',
			shortName: 'F',
			order: order++,
			categoryId: standard.id,
			linkedDanceIds: []};
		const quickstepStandard: Dance = { id: quickstepStandardId,
			name: 'Quickstep',
			shortName: 'QS',
			order: order++,
			categoryId: standard.id,
			linkedDanceIds: []};
		const chachaLatin: Dance = { id: chachaLatinId,
			name: 'Cha Cha',
			shortName: 'CC',
			order: order++,
			categoryId: latin.id,
			linkedDanceIds: []};
		const salsaLatin: Dance = { id: salsaLatinId,
			name: 'Salsa',
			shortName: 'S',
			order: order++,
			categoryId: latin.id,
			linkedDanceIds: []};
		const rumbaLatin: Dance = { id: rumbaLatinId,
			name: 'Rumba',
			shortName: 'R',
			order: order++,
			categoryId: latin.id,
			linkedDanceIds: []};
		const pasoDobleLatin: Dance = { id: pasoDobleLatinId,
			name: 'Paso Doble',
			shortName: 'PD',
			order: 19,
			categoryId: latin.id,
			linkedDanceIds: []};
		const jiveLatin: Dance = { id: jiveLatinId,
			name: 'Jive',
			shortName: 'J',
			order: order++,
			categoryId: latin.id,
			linkedDanceIds: []};
		competition.dances = [ 
			waltzSmooth, 
			tangoSmooth,
			foxtrotSmooth,
			vienneseWaltzSmooth,
			chachaRhythm,
			rumbaRhythm,
			ecsRhythm,
			boleroRhythm,
			mamboRhythm,
			merengueRhythm,
			sambaRhythm,
			wcsRhythm,
			hustleRhythm,
			salsaRhythm,
			argTangoRhythm,
			waltzStandard,
			tangoStandard,
			vienneseWaltzStandard,
			foxtrotStandard,
			quickstepStandard,
			chachaLatin,
			salsaLatin,
			rumbaLatin,
			pasoDobleLatin,
			jiveLatin,
		];
		order = 0;
		const smooth3Dance: MultiDance = { id: v4(), 
			categoryId: smooth.id,
			order: order++,
			linkedDanceIds: [ waltzSmoothId, tangoSmoothId, foxtrotSmoothId ]
		};
		const smooth4Dance: MultiDance = { id: v4(), 
			categoryId: smooth.id,
			order: order++,
			linkedDanceIds: [ waltzSmoothId, 
				tangoSmoothId, 
				foxtrotSmoothId, 
				vienneseWaltzSmooth ]
		};
		const standard3Dance: MultiDance = { id: v4(), 
			categoryId: standard.id,
			order: order++,
			linkedDanceIds: [ waltzSmoothId, foxtrotSmoothId, quickstepStandardId ]
		};
		const standard5Dance: MultiDance = { id: v4(), 
			categoryId: standard.id,
			order: order++,
			linkedDanceIds: [ 
				waltzSmoothId, 
				tangoStandardId,
				vienneseWaltzStandardId,
				foxtrotSmoothId,
				quickstepStandardId ]
		};
		const rhythm3Dance: MultiDance = { id: v4(), 
			categoryId: rhythm.id,
			order: order++,
			linkedDanceIds: [ chachaRhythmId, rumbaRhythmId, ecsRhythmId ]
		};
		const rhythm5Dance: MultiDance = { id: v4(), 
			categoryId: rhythm.id,
			order: order++,
			linkedDanceIds: [ 
				chachaRhythmId,
				rumbaRhythmId,
				ecsRhythmId,
				boleroRhythmId,
				mamboRhythmId ]
		};
		const latin3Dance: MultiDance = { id: v4(), 
			categoryId: latin.id,
			order: order++,
			linkedDanceIds: [ chachaLatinId, rumbaLatinId, salsaLatinId ]
		};
		const latin5Dance: MultiDance = { id: v4(), 
			categoryId: latin.id,
			order: order++,
			linkedDanceIds: [ 
				chachaLatinId,
				rumbaLatinId,
				salsaLatinId,
				pasoDobleLatinId,
				jiveLatinId ]
		};
		competition.multiDances = [
			smooth3Dance,
			smooth4Dance,
			standard3Dance,
			standard5Dance,
			rhythm3Dance,
			rhythm5Dance,
			latin3Dance,
			latin5Dance
		];
		order = 0;
		competition.skillLevels = [
			{ id: v4(), order: order++, name: 'Newcomer'},
			{ id: v4(), order: order++, name: 'Intermediate Bronze'},
			{ id: v4(), order: order++, name: 'Full Bronze'},
			{ id: v4(), order: order++, name: 'Open Bronze'},
			{ id: v4(), order: order++, name: 'Newcomer Silver'},
			{ id: v4(), order: order++, name: 'Intermediate Silver'},
			{ id: v4(), order: order++, name: 'Full Silver'},
			{ id: v4(), order: order++, name: 'Open Silver'},
			{ id: v4(), order: order++, name: 'Gold'},
			{ id: v4(), order: order++, name: 'Open Gold'}
		];
		order = 0;
		competition.multiEventSkillLevels = [
			{ id: v4(), order: order++, name: 'Bronze'},
			{ id: v4(), order: order++, name: 'Silver'},
			{ id: v4(), order: order++, name: 'Open'}
		];

		order = 0;
		competition.multiEventAgeGroups = [
			{ id: v4(), order: order++, fromAge: 18, toAge: 49, name: 'A' },
			{ id: v4(), order: order++, fromAge: 50, toAge: '+', name: 'B' }
		];
		return competition;
	}
};