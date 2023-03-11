import { Vector2 } from '@/core/Vector2';
import { EventEmitter } from '@/core/Event';
import type { TouchesController } from '@/core/TouchesController';


export class Camera extends EventEmitter {
	public readonly position = new Vector2();
	public readonly scale = new Vector2(1, 1);

	public _rotation: number = 0;
	public get rotation(): number { return this._rotation; }
	public set rotation(v: number) { this._rotation = v; }

	constructor(public readonly size: Vector2) {
		super();
	}

	public get vw() { return this.size.x / 100; }
	public get vh() { return this.size.y / 100; }
	public get vwh() { return this.size.x / this.size.y; }
	public get vhw() { return this.size.y / this.size.x; }
	public get vmax() { return Math.max(this.size.x, this.size.y) / 100; }
	public get vmin() { return Math.min(this.size.x, this.size.y) / 100; }

	public process(dt: number, touches: TouchesController): void {
		;
	}
}
