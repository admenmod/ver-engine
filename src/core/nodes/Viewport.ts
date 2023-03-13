import { Node, LayersList } from '@/core/nodes/Node';
import { Vector2 } from '@/core/Vector2';


export class Viewport extends Node {
	constructor(public readonly screen: Vector2) {
		super();
	}
}
