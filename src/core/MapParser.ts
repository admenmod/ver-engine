import { Vector2 } from '@/core/Vector2';
import { EventEmitter, Event } from '@/core/Event';
import { loadImage } from '@/core/helpers';


export interface IProperty {
	name: string;
	type: string;
	value: string;
}

export interface ITile {
	id: number;
	properties: IProperty[];
}

export interface ILayer {
	data: Uint8Array | Uint16Array | Uint32Array;

	id: number;
	name: string;
	type: string;

	visible: boolean;
	opacity: number;

	width: number;
	height: number;

	x: number;
	y: number;

	offsetx: number;
	offsety: number;

	properties: any[];
}

export interface ITileset {
	name: string;

	image: string;
	imagewidth: number;
	imageheight: number;

	columns: number;
	firstgid: number;
	margin: number;
	spacing: number;

	tilecount: number;
	tilewidth: number;
	tileheight: number;

	tiles: ITile[];

	properties: IProperty[];
}

export interface IMap {
	version: number;
	type: string;

	width: number;
	height: number;

	nextlayerid: number;
	nextobjectid: number;
	infinite: boolean;
	orientation: string;
	renderorder: string;

	tiledversion: string;
	tilewidth: number;
	tileheight: number;

	layers: ILayer[];
	tilesets: ITileset[];
	properties: IProperty[];
}


const BASE64 = 'data:image/png;base64,';


type Property_ = Property;
class Property extends EventEmitter implements IProperty {
	public name!: string;
	public type!: string;
	public value!: string;

	constructor() {
		super();
	}
}


type Tile_ = Tile;
class Tile extends EventEmitter {
	constructor() {
		super();
	}
}


type Layer_ = Layer;
class Layer extends EventEmitter {
	constructor() {
		super();
	}
}


type Tileset_ = Tileset;
class Tileset extends EventEmitter {
	public '@load' = new Event<Tileset, [ITileset]>(this);

	public data!: ITileset;

	public isLoaded: boolean = false;
	public imagedata!: HTMLImageElement;

	constructor() {
		super();
	}


	public load(tileset: ITileset): Promise<void> {
		return loadImage(BASE64 + tileset.properties[0].value, tileset.imagewidth, tileset.imageheight).then(img => {
			this.data = tileset;

			this.imagedata = img;
			this.imagedata.name = tileset.image;

			this.isLoaded = true;

			(this as Tileset).emit('load', tileset);
		}).catch(console.error);
	}
}


type Map_ = Map;
class Map extends EventEmitter {
	public '@load' = new Event<Map, [IMap]>(this);
	public '@load:tileset' = new Event<Map, [ITileset, Tileset]>(this);

	public data!: IMap;

	public src: string = '';
	public isLoaded: boolean = false;

	public scale = new Vector2(1, 1);

	public tilesets: Tileset[] = [];

	constructor() {
		super();
	}


	public load(src: string): Promise<void> {
		this.src = src;

		return fetch(src).then(data => data.json()).then((map: IMap) => {
			this.data = map;

			for(let i = 0; i < map.layers.length; i++) {
				map.layers[i].data = new Uint16Array(map.layers[i].data);
			}


			const proms = [];

			for(let i = 0; i < map.tilesets.length; i++) {
				const tileset = new Tileset();

				this.tilesets.push(tileset);
				proms.push(tileset.load(map.tilesets[i]));
			}


			Promise.all(proms).then(data => {
				//	console.log(this.tilesets);

				this.isLoaded = true;
				(this as Map).emit('load', map);
			});
		}).catch(console.error);
	}
}


export declare namespace MapParser {
	export type Property = Property_;
	export type Tile = Tile_;
	export type Layer = Layer_;
	export type Tileset = Tileset_;
	export type Map = Map_;
}


export class MapParser extends EventEmitter {
	constructor() {
		super();
	}

	public static Map = Map;
	public static Tileset = Tileset;
}


/*
	let Map = this.Map = class Map extends EventEmitter {
		constructor(path, prefix = './') {
			super();
			let self = this;
			this.isLoaded = false;
			
			this.pos = vec2();
			this.scale = vec2(1, 1);
			
			fetch(prefix+path).then(data => data.json()).then(data => {
				Object.assign(this, data);
				
				for(let i = 0; i < this.layers.length; i++) {
					let layer = this.layers[i];
					layer.data = new Uint16Array(layer.data);
				};
				
				let proms = [];
				for(let i = 0; i < this.tilesets.length; i++) {
					let tileset = this.tilesets[i];
					
					proms.push(loadImage(BASE64+tileset.value, tileset.imagewidth, tileset.imageheight)
					.then(img => {
						img.name = tileset.image;

						tileset.imagedata = img;
						tileset.isLoaded = true;
						
						this.pos = vec2(this.x, this.y);
						this.scale = vec2(1, 1);
						
						this.emit('loadtileset', tileset);
					}).catch(err => console.warn('Error: '+err.path[0].src)));
				};
				
				Promise.all(proms).then(data => {
				//	console.log(this.tilesets);
					
					this.isLoaded = true;
					this.emit('load', this);
				});
			}).catch(console.error);
		}
		
		_cacheTile = {}
		
		draw(ctx, pos = this.pos) {
			if(!this.isLoaded) return;
			
			ctx.save();
			for(let layer of this.layers) {
				if(!layer.visible) continue;
				
				let sx = this.scale.x,
					sy = this.scale.y;
				
				for(let i = 0; i < layer.data.length; i++) {
					let id = layer.data[i];
					let ly = Math.floor(i/layer.width),
						lx = i % layer.width;
					
					if(id === 0) continue;
					
					let tileset = null;
					if(!(tileset = this._cacheTile[id])) {
						for(let i = 0; i < this.tilesets.length; i++) {
							tileset = this.tilesets[i];
							let next = this.tilesets[i+1];
							
							if(!next || tileset.firstgid <= id && next.firstgid > id) {
								this._cacheTile[id] = tileset;
								break;
							};
						};
					};
					
					if(!tileset || !tileset.isLoaded) {
						console.error('tileset not fined');
						continue;
					};
					
					let tid = id-tileset.firstgid;
					let ty = Math.floor(tid/tileset.columns),
						tx = tid % tileset.columns;
					
					let tw = tileset.tilewidth,
						th = tileset.tileheight;
					
					let gtw = this.tilewidth,
						gth = this.tileheight;
					
					ctx.drawImage(tileset.imagedata, tx*tw, ty*th, tw, th, pos.x + lx*gtw*sx, pos.y + ly*gth*sy, tw*sx, th*sy);
				};
			};
			
			ctx.restore();
		}
	};
	
	let loadMap = this.loadMap = (...args) => new Promise((res, rej) => new Map(...args).once('load', res));
});
*/
