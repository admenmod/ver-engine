import { Vector2 } from '@/core/Vector2';
import { Node2D } from '@/core/nodes/Node2D';
import { MapParser } from '@/core/MapParser';


export class TileMap extends Node2D {
	constructor(public map: MapParser.Map) {
		super();
	}

	protected _draw(ctx: CanvasRenderingContext2D, pos: Vector2, scale: Vector2, rot: number, pixelDensity: number): void {
		;
	}
}
