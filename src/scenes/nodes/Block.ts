import { Vector2 } from "@/core/Vector2";
import { Node2D } from "@/core/nodes/Node2D";
import { Sprite2D } from "@/core/nodes/Sprite2D";


export class Block extends Node2D {
	public readonly size = new Vector2(10, 10);

	constructor() {
		super();

		// this.addChild(new Sprite2D(), 'Sprite2D');
	}
	
	protected async _ready() {
		// await Promise.all([
		// 	// this.getNode<Sprite2D>('Sprite2D')!.load('../../public/vite.svg')
		// ]);
	}

	protected _draw(ctx: CanvasRenderingContext2D, pos: Vector2, scale: Vector2, rot: number) {
		super._draw(ctx, pos, scale, rot);

		const size = this.size.buf().inc(scale);

		ctx.save();
		ctx.fillStyle = '#ff1111';
		ctx.fillRect(pos.x, pos.y, size.x, size.y);
		ctx.restore();
	}
}
