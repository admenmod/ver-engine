import { Vector2 } from '@/core/Vector2';
import { EventEmitter, Event } from '@/core/Event';
import { TouchesController } from '@/core/TouchesController';
import { CanvasLayer } from '@/core/CanvasLayer';
import { SensorCamera } from '@/scenes/nodes/SensorCamera';
import { MainLoop } from '@/core/MainLoop';
import { Node } from '@/core/nodes/Node';
import { MainScene } from '@/scenes/MainScene';


export type LayersList = { [id: string]: CanvasRenderingContext2D };


export const appElement = document.querySelector<HTMLDivElement>('#app');
if(!appElement) throw new Error('app is not found');

export const canvas = new CanvasLayer();
appElement.append(canvas);


export const layers: LayersList = {};

for(let id in canvas.layers) {	
	layers[id] = canvas.layers[id].getContext('2d')!;
}


export const touches = new TouchesController(canvas);


export const gm = new class GameManager extends EventEmitter {
	public '@resize' = new Event<this, [Vector2]>(this);

	public '@camera.scale' = new Event<this, [Vector2]>(this);


	public screen = new Vector2(canvas.size);
	public camera = new SensorCamera(this.screen);
	public readonly root = new Node();


	constructor() {
		super();

		canvas['@resize'].on(size => {
			this.screen.set(size);
			this.camera.size.set(size);

			this['@resize'].emit(size);
		});


		this.camera['@scale'].on(scale => this['@camera.scale'].emit(scale));
	}
}




//@ts-ignore
canvas.ondblclick = () => canvas.webkitRequestFullscreen();


gm.root.addChild(new MainScene());


const mainLoop = new MainLoop();

mainLoop.on('update', dt => {
	gm.root.process(dt);
	gm.root.render(layers, gm.camera);
	touches.nullify();
});

mainLoop.start();

gm.root.ready().then(() => {
	gm.root.init();
});
