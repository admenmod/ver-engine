export declare namespace Player {
	//@ts-ignore
	interface IOption {
		type?: 'Player',
		HP?: 1000,
	}
}


import IOption = Player.IOption;


export class Player {
	constructor(p: IOption = <IOption>{}) {
		Object.assign(p, <IOption>{
		});
	}
}
