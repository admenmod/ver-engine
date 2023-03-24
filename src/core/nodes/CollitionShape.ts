import { Node2D } from '@/core/nodes/Node2D';
import { b2Shapes } from '@/core/Box2DAliases';


export class CollisionShape extends Node2D {
	public shape: b2Shapes.b2Shape;

	constructor(shape: b2Shapes.b2Shape) {
		super();

		this.shape = shape;
	}
}
