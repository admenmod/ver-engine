import type { Camera } from '@/core/Camera';
import { Vector2 } from '@/core/Vector2';
import { KeyboardInputInterceptor } from '@/core/KeyboardInputInterceptor';
import { KeymapperOfActions } from '@/core/KeymapperOfActions';
import { Node2D } from '@/core/nodes/Node2D';
import { GridMap } from '@/core/GridMap';
import { LayersList, touches, canvas, layers, gm, mapParser } from '@/global';
import { Player } from '@/scenes/nodes/Player';
import { Joystick } from '@/core/Joystick';
import { Block } from '@/scenes/nodes/Block';
import { TileMap } from '@/core/TileMap';
import { Popup } from '@/scenes/nodes/Popup';


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


	private popups: Popup[] = [];


	private keymapperOfActions!: KeymapperOfActions;

	constructor() {
		super();

		const hiddenInput = document.createElement('input');
		hiddenInput.style.position = 'fixed';
		hiddenInput.style.top = '-1000px';
		canvas.append(hiddenInput);

		const keyboardInputInterceptor = new KeyboardInputInterceptor(hiddenInput);
		keyboardInputInterceptor.init();
		canvas.addEventListener('click', () => keyboardInputInterceptor.focus());

		keyboardInputInterceptor.on('key:all', e => {
			console.log(e.type, e.key, e);
		});


		const keymapperOfActions = new KeymapperOfActions('normal');
		this.keymapperOfActions = keymapperOfActions;
		keymapperOfActions.init(keyboardInputInterceptor);
		keymapperOfActions.enable();


		const onmappings: KeymapperOfActions.Action = ({ mapping }) => {
			let text: string = '';

			switch(mapping.join('|')) {
				case 'ctrl-l': text = 'list l';
					break;
				case 'ctrl- ': text = 'list space';
					break;
				case 'a|a': text = 'a + a';
					break;
				case 'a|a|ArrowUp': text = 'Сверху нет ничего интересного :(';
					break;
				case '\\|h': text = 'Hi';
					break;
				case '\\|h|s': text = 'Hello';
					break;
				default: text = 'Забыл обработать :)'
					break;
			}


			const popup = new Popup({
				pos: this.player.position.buf().add(0, -1.5),
				text: text
			});

			popup.ready();
			this.popups.push(popup);
		};

		keymapperOfActions.reqister(0, [' '], () => this.player.jump());

		keymapperOfActions.reqister(0, ['ctrl- '], onmappings);
		keymapperOfActions.reqister(0, ['ctrl-l'], onmappings);

		keymapperOfActions.reqister(0, ['\\', 'h'], onmappings);
		keymapperOfActions.reqister('normal', ['\\', 'h', 's'], onmappings);
		keymapperOfActions.reqister('normal', ['a', 'a'], onmappings);
		keymapperOfActions.reqister(0, ['a', 'a', 'ArrowUp'], onmappings);

		alert(
`global: ${JSON.stringify(keymapperOfActions.gmaps.map(i => i.mapping.join('|')), null, '\t')
}, ${
	JSON.stringify([...keymapperOfActions.mapmap].map(([mode, maps]) => {
		return `mode: ${mode.toString()} > ${
			JSON.stringify(maps.map(i => i.mapping.join('|')), null, '\t')
		}`;
	}), null, '\t')
}`);


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
		this.keymapperOfActions.update(dt);


		this.joystick.update(touches);

		const player = this.getNode<Player>('Player')!;

		gm.camera.position.moveTime(player.globalPosition, 10);

		gm.camera.process(dt, touches);


		for(let i = 0, len = this.popups.length; i < len; i++) {
			this.popups[i].process(dt);
			const l = this.popups.findIndex(i => i.alpha <= 0);

			if(~l) {
				this.popups.splice(l, 1);
				i--;
				len--;
			}
		}


		this.systemInfoDrawObject.update(dt);
	}

	protected _render(layers: LayersList, camera: Camera): void {
		layers.main.clearRect(0, 0, gm.screen.x, gm.screen.y);

		layers.main.save();
		layers.main.beginPath();

		this.gridMap.draw(layers.main, camera.getDrawPosition());


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
		layers.main.fillText('timeout: ' + this.keymapperOfActions.timeout.toFixed(0), 10, 120);
		layers.main.restore();


		for(let i = 0; i < this.popups.length; i++) this.popups[i].render(layers, camera);


		this.joystick.draw(layers.main);


		this.systemInfoDrawObject.draw(layers.main);
	}

	//========== Exit ==========//
	protected _exit(): void {
		console.log(this.name, 'exit');
	}
}
