import { Vector2 } from '@/core/Vector2';
import { Node2D } from '@/core/nodes/Node2D';
import { MapParser } from '@/core/MapParser';
import { b2w } from '@/global';
import { b2Body } from '@/core/Box2DAliases';


const mapParser = new MapParser();

export class TileMap extends Node2D {
	public map!: MapParser.Map;
	public readonly physicsSize = new Vector2(1, 1);

	private physicsBodyAll: b2Body[] = [];
	private _cacheTile: { [id: number]: MapParser.Tileset } = {};


	constructor(public readonly src: string, physicsSize?: Vector2) {
		super();

		if(physicsSize) this.physicsSize.set(physicsSize);
	}

	protected async _ready(): Promise<void> {
		await super._ready();

		this.map = await mapParser.loadMap(this.src);
	}

	protected _init(): void {
		this._initPhysicsBody(this.physicsSize);
	}


	private _initPhysicsBody(size: Vector2): void {
		const map = this.map;
		const layer = map.layers[0];

		for(let i = 0; i < layer.data.length; i++) {
			const count = layer.size.buf();

			const id: number = layer.data[i];

			if(id === 0) continue;
			const l = new Vector2(i % count.x, Math.floor(i / count.x));

			let tileset!: MapParser.Tileset;

			if(!(tileset = this._cacheTile[id])) {
				for(let i = 0; i < map.tilesets.length; i++) {
					if(map.tilesets[i].firstgid <= id && !map.tilesets[i+1] || id < map.tilesets[i+1].firstgid) {
						tileset = map.tilesets[i];
						this._cacheTile[id] = tileset;
						break;
					}
				}
			}

			if(!tileset) {
				console.error('tileset not fined');
				continue;
			}

			const tid = id - tileset.firstgid;
			const tile = tileset.tiles.find(i => i.id === tid);
			const t = tile?.properties.find(i => i.name === 'collision_type');
			if(!t) continue;

			const pos = new Vector2(l).inc(size).add(this.globalPosition);

			const body = b2w.createBox(pos, size.buf(), 0, +t.value);


			this.physicsBodyAll.push(body);
		}
	}


	// protected _render(layers: LayersList, camera: Camera): void {
	// 	super._render(layers, camera);
	// }

	protected _draw(ctx: CanvasRenderingContext2D, pos: Vector2, scale: Vector2, rot: number, pixelDensity: number): void {
		const map = this.map;

		ctx.save();

		for(let i = 0; i < map.layers.length; i++) {
			const layer = map.layers[i];

			if(!layer.visible) continue;

			for(let i = 0; i < layer.data.length; i++) {
				const count = layer.size.buf();

				const id: number = layer.data[i];

				if(id === 0) continue;
				const l = new Vector2(i % count.x, Math.floor(i / count.x));

				let tileset!: MapParser.Tileset;

				if(!(tileset = this._cacheTile[id])) {
					for(let i = 0; i < map.tilesets.length; i++) {
						if(map.tilesets[i].firstgid <= id && !map.tilesets[i+1] || id < map.tilesets[i+1].firstgid) {
							tileset = map.tilesets[i];
							this._cacheTile[id] = tileset;
							break;
						}
					}
				}

				if(!tileset) {
					console.error('tileset not fined');
					continue;
				}

				const tid = id - tileset.firstgid;
				const tc = new Vector2(tid % tileset.columns, Math.floor(tid / tileset.columns));

				const size = new Vector2(this.physicsSize).inc(scale).inc(pixelDensity);

				const tileoffset = new Vector2(tc).inc(tileset.tile_size);
				const tilesize = new Vector2(tileset.tile_size);
				const drawsize = new Vector2(size);
				const drawpos = new Vector2(l).inc(size).add(pos).sub(drawsize.buf().div(2));

				ctx.drawImage(
					tileset.imagedata,
					tileoffset.x, tileoffset.y, tilesize.x, tilesize.y,
					drawpos.x, drawpos.y, drawsize.x, drawsize.y
				);

				// ctx.drawImage(
				// 	tileset.imagedata,
				// 	tc.x * tileset.tile_size.x, tc.y * tileset.tile_size.y,
				// 	tileset.tile_size.x, tileset.tile_size.y,
				// 	pos.x + l.x * gt.x * scale.x, pos.y + l.y * gt.y * scale.y,
				// 	tileset.tile_size.x * scale.x, tileset.tile_size.y * scale.y
				// );
			}
		}

		ctx.restore();
	}
}
