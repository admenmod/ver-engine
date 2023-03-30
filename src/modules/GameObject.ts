import { Vector2 } from '@/core/Vector2';
import { EventDispatcher, Event } from '@/core/events';


export declare namespace GameObject {
	interface IOption {
		position?: Vector2;
	}
}


import IOption = GameObject.IOption;


export class GameObject extends EventDispatcher {
	public readonly position = new Vector2();

	constructor(p: IOption = <IOption>{}) {
		super();

		if(p.position) this.position.set(p.position);
	}
}
