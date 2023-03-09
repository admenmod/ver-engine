import { Node, LayersList } from "@/core/nodes/Node";
import { vec2, Vector2 } from '@/core/Vector2';
import { CanvasLayer } from '@/core/CanvasLayer';
// import { GridMap } from '@/core/GridMap';
// import { MotionByTouch } from '@/core/MotionByTouch';


export class Viewport extends Node {
	public readonly canvas: CanvasLayer;
	public readonly layers: LayersList = {};
	// public readonly screen: Vector2;


	constructor(canvasElement: CanvasLayer) {
		super();

		this.canvas = canvasElement;

		// for(let id in this.canvas.layers) {	
		// 	this.layers[id] = this.canvas.layers[id].getContext('2d')!;
		// };

		// this.screen = new Vector2(this.canvas.size);
		
		// this.canvas['@resize'].on(size => this.screen.set(size));

		// this.globalGridMap.size.set(screenSize);


		// export const motionByTouch = new MotionByTouch();
		// export const globalGridMap = new GridMap({ size: screenSize, coordinates: true });



		// canvas.addEventListener('dblclick', () => canvas.requestFullscreen());
	}
}
