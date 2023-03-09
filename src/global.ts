import { TouchesController } from '@/core/TouchesController';
import { CanvasLayer } from '@/core/CanvasLayer';
import { App } from '@/App';
import { SensorCamera } from '@/scenes/nodes/SensorCamera';


export type LayersList = { [id: string]: CanvasRenderingContext2D };


export const app = document.querySelector<HTMLDivElement>('#app');
if(!app) throw new Error('app is not found');


export const canvas = new CanvasLayer();
app.append(canvas);

export const touches = new TouchesController(canvas);

export const layers: LayersList = {};
for(let id in canvas.layers) {	
	layers[id] = canvas.layers[id].getContext('2d')!;
};

export const screenSize = canvas.size;
export const camera = new SensorCamera(screenSize);

canvas['@resize'].on(size => {
	screenSize.set(size);
	camera.size.set(size);
});

//@ts-ignore
canvas.ondblclick = () => canvas.webkitRequestFullscreen();


App.init();
