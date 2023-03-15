import { Vector2 } from '@/core/Vector2';
import { Node2D } from '@/core/nodes/Node2D';
import { b2w } from '@/global';
import { b2Body } from '@/core/Box2DAliases';


export class Block extends Node2D {
	public size = new Vector2(1, 1);

	public staticBody: b2Body;


	constructor(p: {
		size: Vector2,
		pos?: Vector2
	}) {
		super();

		this.position.set(p.pos || new Vector2());
		this.size.set(p.size);

		this.staticBody = b2w.createBox(this.position, this.size, 0, 0);
		// this.addChild(new Sprite2D(), 'Sprite2D');
	}
	
	protected async _ready() {
		// await Promise.all([
		// 	// this.getNode<Sprite2D>('Sprite2D')!.load('../../public/vite.svg')
		// ]);
	}

	protected _process(dt: number): void {
		this.position.set(Vector2.from(this.staticBody.GetPosition()));
		this.rotation = this.staticBody.GetAngle();
	}

	protected _draw(ctx: CanvasRenderingContext2D, pos: Vector2, scale: Vector2, rot: number, pixelDensity: number) {
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
