import { Node } from '@/core/nodes/Node';
import { Vector2 } from '../Vector2';


export class CanvasItem extends Node {
	constructor() {
		super();
	}


	protected _draw(ctx: CanvasRenderingContext2D, pos: Vector2, scale: Vector2, rot: number) {}
}
