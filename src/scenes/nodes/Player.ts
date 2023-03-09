import { Vector2 } from '@/core/Vector2';
import { Node2D } from '@/core/nodes/Node2D';
import type { Joystick } from '@/core/Joystick';


export class Player extends Node2D {
	public velocity = new Vector2();

	public size = new Vector2(20, 20);
	public speed = 0.01;
	public maxspeed = 10000;
	public rub = 0.95;

	public joystick: Joystick | null = null;

	constructor() {
		super();
	}

	protected _process(dt: number): void {
		if(this.joystick) {
			this.velocity.moveAngle(this.joystick.value * this.speed * dt, this.joystick.angle);

			if(this.velocity.module > this.maxspeed) this.velocity.normalize(this.maxspeed);
		}

		this.position.add(this.velocity.inc(this.rub));
	}

	protected _draw(
		ctx: CanvasRenderingContext2D,
		pos: Vector2,
		scale: Vector2,
		rot: number
	) {
		super._draw(ctx, pos, scale, rot);

		const size = this.size.buf().inc(scale);

		ctx.save();
		ctx.fillStyle = '#ff1111';
		ctx.fillRect(pos.x, pos.y, size.x, size.y);
		ctx.restore();
	}
}
