import { Vector2 } from '@/core/Vector2';
import { Node2D } from '@/core/nodes/Node2D';
import type { Joystick } from '@/core/Joystick';
import { b2w } from '@/global';
import { b2Body, b2Vec2 } from '@/core/Box2DAliases';


export class Player extends Node2D {
	public velocity = new Vector2();

	public size = new Vector2(1, 1);
	public speed = 0.01;
	public maxspeed = 30;
	public rub = 0.9;

	public joystick: Joystick | null = null;

	public dinamicBody: b2Body;


	public isAir: boolean = false;


	constructor(p: {
		size?: Vector2,
		pos?: Vector2
	} = {}) {
		super();

		this.position.set(p.pos || new Vector2());
		this.size.set(p.size || new Vector2(1, 1));

		this.dinamicBody = b2w.createBox(this.position, this.size, 0, 2);
		this.dinamicBody.SetSleepingAllowed(false);
		this.dinamicBody.SetFixedRotation(true);
	}

	protected _process(dt: number): void {
		this.velocity.set(Vector2.from(this.dinamicBody.GetLinearVelocity()));

		if(this.joystick) {
			this.velocity.moveAngle(this.joystick.value * this.speed * dt, this.joystick.angle);
			if(this.velocity.module > this.maxspeed) this.velocity.normalize(this.maxspeed);
		}

		// this.velocity.inc(this.rub);

		this.dinamicBody.SetLinearVelocity(new b2Vec2(this.velocity.x, this.velocity.y));

		this.position.set(Vector2.from(this.dinamicBody.GetPosition()));
		this.rotation = this.dinamicBody.GetAngle();
	}

	protected _draw(
		ctx: CanvasRenderingContext2D,
		pos: Vector2,
		scale: Vector2,
		rot: number,
		pixelDensity: number
	) {
		super._draw(ctx, pos, scale, rot, pixelDensity);

		const size = this.size.buf().inc(scale).inc(pixelDensity);
		pos.sub(size.buf().div(2));

		ctx.save();
		ctx.translate(pos.x + size.x/2, pos.y + size.y/2);
		ctx.rotate(rot);
		ctx.translate(-(pos.x + size.x/2), -(pos.y + size.y/2));
		ctx.fillStyle = '#ff1111';
		ctx.fillRect(pos.x, pos.y, size.x, size.y);
		ctx.restore();
	}
}
