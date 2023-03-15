import { Vector2 } from '@/core/Vector2';
import { Node2D } from '@/core/nodes/Node2D';
import { GridMap } from '@/core/GridMap';
import { LayersList, touches, canvas, layers, gm, mapParser } from '@/global';
import { Player } from '@/scenes/nodes/Player';
import { Joystick } from '@/core/Joystick';
import type { Camera } from '@/core/Camera';
import { Block } from '@/scenes/nodes/Block';
import { MapParser } from '@/core/MapParser';
import { TileMap } from '@/core/TileMap';
import {b2Vec2} from '@/core/Box2DAliases';


export class MainScene extends Node2D {
	public gridMap = new GridMap({
		tile: new Vector2().set(gm.camera.pixelDensity),
		size: gm.screen
	});

	public joystick = new Joystick();


	private systemInfoDrawObject = {
		textFPS: '',
		textScreenSize: '',

		padding: new Vector2(10, 10),
		time: 0,

		update(dt: number) {
			if(this.time > 100) {
				this.textFPS = `FPS: ${(1000/dt).toFixed(2)}`;
				this.textScreenSize = `Screen size: ${gm.screen.x}, ${gm.screen.y}`;

				this.time = 0;
			};

			this.time += dt;
		},

		draw(ctx: CanvasRenderingContext2D) {
			ctx.save();
			ctx.beginPath();

			ctx.font = `18px arkhip, Arial`;
			ctx.textBaseline = 'top';

			ctx.strokeStyle = '#111111';
			ctx.strokeText(this.textFPS, this.padding.x, this.padding.y);
			ctx.fillStyle = '#eeeeee';
			ctx.fillText(this.textFPS, this.padding.x, this.padding.y);


			ctx.textAlign = 'end';
			ctx.textBaseline = 'bottom';

			ctx.strokeStyle = '#111111';
			ctx.strokeText(this.textScreenSize, gm.screen.x - 10, gm.screen.y - 10);
			ctx.fillStyle = '#eeeeee';
			ctx.fillText(this.textScreenSize, gm.screen.x - 10, gm.screen.y - 10);

			ctx.restore();
		}
	};


	constructor() {
		super();

		const updateOnResize = (size: Vector2) => {
			this.joystick.pos.set(canvas.size.buf().sub(this.joystick.radius).sub(5 * canvas.vw, 5 * canvas.vh));
			this.joystick.syncPos();

			this.gridMap.size.set(size);
		};

		updateOnResize(gm.screen);

		gm.on('resize', updateOnResize);
		gm.on('camera.scale', scale => this.gridMap.scale.set(scale));


		const tilemap = this.addChild(new TileMap('maps/test-map.json'), 'TileMap');

		const player = this.addChild(new Player({
			pos: new Vector2(8, 8),
			size: new Vector2(0.95, 0.95)
		}), 'Player');
		player.joystick = this.joystick;


		console.log(`Initialize scene "${this.name}"`);
	}

	//========== Init ==========//
	protected _init(): void {
		console.log(this.getNode<TileMap>('TileMap')?.map);

		console.log(`Scene: ${this.name}\nScreen size: ${gm.screen.x}, ${gm.screen.y}`);
	}

	//========== Update ==========//
	protected _process(dt: number): void {
		this.joystick.update(touches);

		const touch = touches.findTouch(t => t.isPress());
		if(touch && touch.x < gm.screen.x/2) {
			const body = this.getNode<Player>('Player')!.dinamicBody;

			const v = body.GetLinearVelocity();
			v.Add(new b2Vec2(0, -10));
			body.SetLinearVelocity(v);
		}

		const player = this.getNode<Player>('Player')!;

		gm.camera.position.moveTime(player.globalPosition, 10);


		gm.camera.process(dt, touches);


		this.systemInfoDrawObject.update(dt);
	}

	protected _render(layers: LayersList, camera: Camera): void {
		layers.main.clearRect(0, 0, gm.screen.x, gm.screen.y);

		layers.main.save();
		layers.main.beginPath();

		const center = this.getDrawPosition(camera);

		let a = 30 * camera.scale.x;
		layers.main.strokeStyle = '#ffff00';
		layers.main.moveTo(center.x, center.y-a);
		layers.main.lineTo(center.x, center.y+a);
		layers.main.moveTo(center.x-a, center.y);
		layers.main.lineTo(center.x+a, center.y);
		layers.main.stroke();
		layers.main.restore();


		this.gridMap.draw(layers.main, camera.getDrawPosition());


		this.joystick.draw(layers.main);


		this.systemInfoDrawObject.draw(layers.main);
	}

	//========== Exit ==========//
	protected _exit(): void {
		console.log(this.name, 'exit');
	}
}
