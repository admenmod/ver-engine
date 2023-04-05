//TODO: сделатать сис мапингов как в nvim
//TODO: сделать алерт в канвасе для вывода сообщений
import { Vector2 } from '@/core/Vector2';
import { KeyboardInputInterceptor } from '@/core/KeyboardInputInterceptor';
import { Node2D } from '@/core/nodes/Node2D';
import { GridMap } from '@/core/GridMap';
import { LayersList, touches, canvas, layers, gm, mapParser } from '@/global';
import { Player } from '@/scenes/nodes/Player';
import { Joystick } from '@/core/Joystick';
import { Block } from '@/scenes/nodes/Block';
import { TileMap } from '@/core/TileMap';
import type { Camera } from '@/core/Camera';


export class MainScene extends Node2D {
	public player!: Player;

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


	private tik: number = 0;
	private sume: string = '';
	private sumeprev: string = '';
	private resetMaping() {
		this.tik = 0;
		this.sume = '';
		this.sumeprev = '';
	}

	constructor() {
		super();

		const hiddenInput = document.createElement('input');
		hiddenInput.style.position = 'fixed';
		hiddenInput.style.top = '-1000px';
		canvas.append(hiddenInput);

		const keyboardInputInterceptor = new KeyboardInputInterceptor(hiddenInput);
		keyboardInputInterceptor.init();
		canvas.addEventListener('click', () => keyboardInputInterceptor.focus());


		keyboardInputInterceptor.on('keydown:input', e => {
			const maping = '\\hs';

			if(this.sume.length < maping.length) {
				this.sume += e.key;
				this.tik = 0;
			}

			console.log(this.sume, this.sumeprev, this.tik);

			if(this.sume === maping) {
				alert(maping +', '+ 'Привет!');
				this.resetMaping();
			}
		});


		const updateOnResize = (size: Vector2) => {
			this.joystick.pos.set(canvas.size.buf().sub(this.joystick.radius).sub(5 * canvas.vw, 5 * canvas.vh));
			this.joystick.syncPos();

			this.gridMap.size.set(size);
		};

		updateOnResize(gm.screen);

		gm.on('resize', updateOnResize);
		gm.on('camera.scale', scale => this.gridMap.scale.set(scale));


		const tilemap = this.addChild(new TileMap('maps/test-map.json'), 'TileMap');

		const player = this.player = this.addChild(new Player({
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
		if(this.tik > 400) {
			this.resetMaping();
		} else if(this.sume.length && this.sume.length === this.sumeprev.length) this.tik += dt;
		this.sumeprev = this.sume;


		this.joystick.update(touches);

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

		layers.main.fillStyle = '#eeeeee';
		layers.main.font = '20px Arial';
		layers.main.fillText('isJump: ' + this.player.isGround, 10, 100);
		layers.main.fillText('tik: ' + this.tik.toFixed(2), 10, 120);
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
