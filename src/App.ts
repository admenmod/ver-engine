import { MainLoop } from '@/core/MainLoop';
import { MainScene } from '@/scenes/MainScene';

import { touches, canvas, layers, camera } from '@/global';


export class App {
	public static init(): void {
		const mainLoop = new MainLoop();
		const main_scene = new MainScene();


		mainLoop.on('update', dt => {
			main_scene.process(dt);
			main_scene.render(layers, camera);
			touches.nullify();
		});

		mainLoop.start();

		main_scene.ready().then(() => {
			main_scene.init();
		});
	}
}
