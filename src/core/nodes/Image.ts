import { Event, EventDispatcher } from '@/core/events';
import { Vector2 } from '@/core/Vector2';


export class Image extends EventDispatcher {
	public '@load' = new Event<Image, [Image]>(this);
	public '@error' = new Event<Image, [Error]>(this);

	public src: string = '';
	private _image = new globalThis.Image();
	public get image() { return this._image; }

	constructor() {
		super();
	}

	public get size() { return new Vector2(this.image.width, this.image.height); }

	protected _load(image: Image) {}
	protected _error(err: Error) {}

	public load(src: string): Promise<Image> {
		const prom = new Promise<Image>((res, rej) => {
			this.image.onload = () => res(this);
			this.image.onerror = () => rej(new Error(`loading image, src: ${this.image.src}`));

			this.image.src = this.src = src;
		});

		prom.then(image => {
			this._load(image);
			(this as Image).emit('load', image);
		}).catch(err => {
			this._error(err);
			(this as Image).emit('error', err);
		}).finally(() => {
			this.image.onload = null;
			this.image.onerror = null;
		});
		
		return prom;
	}
}

