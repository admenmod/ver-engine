import { Vector2 } from '@/core/Vector2';
import { Node2D } from '@/core/nodes/Node2D';
import type { Joystick } from '@/core/Joystick';
import { b2w, gm, touches } from '@/global';
import { b2Body, b2Contacts, b2Shapes, b2Vec2 } from '@/core/Box2DAliases';


const arrayFromList = <T extends { next: T }>(list: T): T[] => {
	const arr: T[] = [];

	if(!list) return arr;

	do { arr.push(list); } while(list = list.next);

	return arr;
};


export class Player extends Node2D {
	public velocity = new Vector2();

	public size = new Vector2(1, 1);
	public speed = 0.01;
	public maxspeed = new Vector2(5, 1000);
	// public rub = 0.99;

	public joystick: Joystick | null = null;

	public dinamicBody: b2Body;


	public isGround: boolean = false;


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

	protected _init(): void {
		let countContact = 0;

		b2w.on('BeginContact', c => {
			const body = c.GetFixtureA().GetBody();
			const block = c.GetFixtureB().GetBody();

			// const a = body.GetPosition();
			// const b = block.GetPosition();
			// const va = (c.GetFixtureB().GetShape() as b2Shapes.b2PolygonShape).GetVertices();
			// const vb = (c.GetFixtureB().GetShape() as b2Shapes.b2PolygonShape).GetVertices();

			// if(body === this.dinamicBody && a.y + va[3].y < b.y + vb[3].y) this.isJump = true;

			const m = c.GetManifold();

			// if(body === this.dinamicBody && m.m_localPoint.y > 0) this.isJump = true;

			countContact++;
			if(body === this.dinamicBody && m.m_localPoint.y > 0) this.isGround = true;
		});


		b2w.on('EndContact', c => {
			// setTimeout(() => {
			// const body = c.GetFixtureA().GetBody();
			const body = this.dinamicBody;

			// const list = arrayFromList(body.GetContactList());

			// console.log(list);

			// if(body === this.dinamicBody && list.length < 100)  this.isJump = false;
			// });

			countContact--;
			if(countContact === 0) this.isGround = false;
		});
	}

	protected _process(dt: number): void {
		const list = arrayFromList(this.dinamicBody.GetContactList());

		if(list.length > 0 && list.some(i => i.contact.GetManifold().m_localPoint.y > 0)) this.isGround = true;
		else this.isGround = false;


		const touch = touches.findTouch(t => t.isPress());
		if(touch && touch.x < gm.screen.x/2 && this.isGround) {
			const body = this.dinamicBody;

			body.GetLinearVelocity().y += -9;
		}



		this.velocity.set(Vector2.from(this.dinamicBody.GetLinearVelocity()));

		if(this.joystick && this.isGround) {
		// if(this.joystick) {
			// this.velocity.moveAngle(this.joystick.value * this.speed * dt, this.joystick.angle);
			let s = Math.abs(this.joystick.angle) < Math.PI/2 ? 1 : -1;
			this.velocity.add(this.joystick.value * this.speed * dt * s, 0);
			// if(this.velocity.module > this.maxspeed) this.velocity.normalize(this.maxspeed);
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
