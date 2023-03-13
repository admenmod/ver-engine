import { Node2D } from '@/core/nodes/Node2D';
import { Shapes } from '@/core/Box2DAliases';


export class CollisionShape extends Node2D {
	public shape: Shapes.b2Shape;

	constructor(shape: Shapes.b2Shape) {
		super();

		this.shape = shape;
	}
}
