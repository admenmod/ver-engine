import { Vector2 } from "@/core/Vector2";
import { Image } from "@/core/nodes/Image";
import { Node2D } from "@/core/nodes/Node2D";


export class Sprite2D extends Node2D {
	private _image = new Image();
	public get image() { return this._image; }
	public set image(v) { this._image = v }

	public size = new Vector2(100, 100);

	constructor() {
		super();
	}

	public async load(src: string): Promise<Image> {
		const image = await this._image.load(src);
		this.size.set(image.size);
		return image;
	}

	protected _draw(
		ctx: CanvasRenderingContext2D,
		pos: Vector2 = this.globalPosition,
		scale: Vector2 = this.globalScale,
		rot: number = this.globalRotation
	) {
		const size = this.size.buf().inc(scale);

		ctx.save();
		ctx.drawImage(this.image.image, pos.x, pos.y, size.x, size.y);
		ctx.restore();
	}
}
