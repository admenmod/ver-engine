import { Vector2 } from "./Vector2";


export class CameraImitationCanvas {
	public ctx: CanvasRenderingContext2D;
	public camera = new Vector2();

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		ctx.canvas;
	}

	get canvas() { return this.ctx.canvas; }
	get globalAlpha() { return this.ctx.globalAlpha; }
	set globalAlpha(v) { this.ctx.globalAlpha = v; }
	get globalCompositeOperation() { return this.ctx.globalCompositeOperation; }
	set globalCompositeOperation(v) { this.ctx.globalCompositeOperation = v; }
	get filter() { return this.ctx.filter; }
	set filter(v) { this.ctx.filter = v; }
	get imageSmoothingEnabled() { return this.ctx.imageSmoothingEnabled; }
	set imageSmoothingEnabled(v) { this.ctx.imageSmoothingEnabled = v; }
	get imageSmoothingQuality() { return this.ctx.imageSmoothingQuality; }
	set imageSmoothingQuality(v) { this.ctx.imageSmoothingQuality = v; }
	get strokeStyle() { return this.ctx.strokeStyle; }
	set strokeStyle(v) { this.ctx.strokeStyle = v; }
	get fillStyle() { return this.ctx.fillStyle; }
	set fillStyle(v) { this.ctx.fillStyle = v; }
	get shadowOffsetX() { return this.ctx.shadowOffsetX; }
	set shadowOffsetX(v) { this.ctx.shadowOffsetX = v; }
	get shadowOffsetY() { return this.ctx.shadowOffsetY; }
	set shadowOffsetY(v) { this.ctx.shadowOffsetY = v; }
	get shadowBlur() { return this.ctx.shadowBlur; }
	set shadowBlur(v) { this.ctx.shadowBlur = v; }
	get shadowColor() { return this.ctx.shadowColor; }
	set shadowColor(v) { this.ctx.shadowColor = v; }
	get lineWidth() { return this.ctx.lineWidth; }
	set lineWidth(v) { this.ctx.lineWidth = v; }
	get lineCap() { return this.ctx.lineCap; }
	set lineCap(v) { this.ctx.lineCap = v; }
	get lineJoin() { return this.ctx.lineJoin; }
	set lineJoin(v) { this.ctx.lineJoin = v; }
	get miterLimit() { return this.ctx.miterLimit; }
	set miterLimit(v) { this.ctx.miterLimit = v; }
	get lineDashOffset() { return this.ctx.lineDashOffset; }
	set lineDashOffset(v) { this.ctx.lineDashOffset = v; }
	get font() { return this.ctx.font; }
	set font(v) { this.ctx.font = v; }
	get textAlign() { return this.ctx.textAlign; }
	set textAlign(v) { this.ctx.textAlign = v; }
	get textBaseline() { return this.ctx.textBaseline; }
	set textBaseline(v) { this.ctx.textBaseline = v; }
	get direction() { return this.ctx.direction; }
	set direction(v) { this.ctx.direction = v; }
	// эти свойства есть не вовсех браузерах
	// //@ts-ignore
	// get fontKerning() { return this.ctx.fontKerning; }
	// //@ts-ignore
	// set fontKerning(v) { this.ctx.fontKerning = v; }
	// //@ts-ignore
	// get fontStretch() { return this.ctx.fontStretch; }
	// //@ts-ignore
	// set fontStretch(v) { this.ctx.fontStretch = v; }
	// //@ts-ignore
	// get fontVariantCaps() { return this.ctx.fontVariantCaps; }
	// //@ts-ignore
	// set fontVariantCaps(v) { this.ctx.fontVariantCaps = v; }
	// //@ts-ignore
	// get wordSpacing() { return this.ctx.wordSpacing; }
	// //@ts-ignore
	// set wordSpacing(v) { this.ctx.wordSpacing = v; }
	// //@ts-ignore
	// get letterSpacing() { return ctx.letterSpacing; }
	// //@ts-ignore
	// set letterSpacing(v) { ctx.letterSpacing = v; }
	// //@ts-ignore
	// get textRendering() { return ctx.textRendering; }
	// //@ts-ignore
	// set textRendering(v) { ctx.textRendering = v; }
	// //@ts-ignore
	// reset() { return this.ctx.reset(); }
	// // @ts-ignore
	// roundRect(x, y, w, h, ...args: any[]) { return this.ctx.roundRect(x-this.camera.x, y-this.camera.y, w, h, ...args); }
	// // @ts-ignore
	// isContextLost() { return this.ctx.isContextLost(); }

	save() { return this.ctx.save(); }
	restore() { return this.ctx.restore(); }
	scale(x: number, y: number) { return this.ctx.scale(x, y); }
	rotate(angle: number) { return this.ctx.rotate(angle); }
	translate(x: number, y: number) { return this.ctx.translate(x-this.camera.x, y-this.camera.y); }
	translateInv(x: number, y: number) { return this.ctx.translate(-(x-this.camera.x), -(y-this.camera.y)); }
	rotateOffset(a: number, v: Vector2 = Vector2.ZERO) {
		this.translate(v.x, v.y);
		this.rotate(a);
		this.translateInv(v.x, v.y);
	}
	transform(...args: Parameters<typeof this.ctx.transform>) { return this.ctx.transform(...args); }
	setTransform(...args: Parameters<typeof this.ctx.setTransform>) { return this.ctx.setTransform(...args); }
	getTransform() { return this.ctx.getTransform(); }
	resetTransform() { return this.ctx.resetTransform(); }
	createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
		return this.ctx.createLinearGradient(x0-this.camera.x, y0-this.camera.y, x1-this.camera.x, y1-this.camera.y);
	}
	createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
		return this.ctx.createRadialGradient(x0-this.camera.x, y0-this.camera.y, r0, x1-this.camera.x, y1-this.camera.y, r1);
	}
	createConicGradient(startAngle: number, x: number, y: number) {
		return this.ctx.createConicGradient(startAngle, x-this.camera.x, y-this.camera.y);
	}
	createPattern(...args: Parameters<typeof this.ctx.createPattern>) { return this.ctx.createPattern(...args); }
	clearRect(x: number, y: number, w: number, h: number) {
		return this.ctx.clearRect(x-this.camera.x, y-this.camera.y, w, h);
	}
	fillRect(x: number, y: number, w: number, h: number) {
		return this.ctx.fillRect(x-this.camera.x, y-this.camera.y, w, h);
	}
	strokeRect(x: number, y: number, w: number, h: number) {
		return this.ctx.strokeRect(x-this.camera.x, y-this.camera.y, w, h);
	}
	beginPath() { return this.ctx.beginPath(); }
	fill(...args: Parameters<typeof this.ctx.fill>) { return this.ctx.fill(...args); }
	stroke(...args: Parameters<typeof this.ctx.stroke>) { return this.ctx.stroke(...args); }
	clip(...args: Parameters<typeof this.ctx.clip>) { return this.ctx.clip(...args); }
	drawFocusIfNeeded(...args: Parameters<typeof this.ctx.drawFocusIfNeeded>) { return this.ctx.drawFocusIfNeeded(...args); }
	isPointInPath(...args: Parameters<typeof this.ctx.isPointInPath>) { return this.ctx.isPointInPath(...args); }
	isPointInStroke(...args: Parameters<typeof this.ctx.isPointInStroke>) { return this.ctx.isPointInStroke(...args); }
	fillText(text: string, x: number, y: number, maxWidth?: number) {
		return this.ctx.fillText(text, x-this.camera.x, y-this.camera.y, maxWidth);
	}
	strokeText(text: string, x: number, y: number, maxWidth?: number) {
		return this.ctx.strokeText(text, x-this.camera.x, y-this.camera.y, maxWidth);
	}
	measureText(text: string) { return this.ctx.measureText(text); }
	drawImage(img: CanvasImageSource, x: number, y: number): void;
	drawImage(img: CanvasImageSource, x: number, y: number, w: number, h: number): void;
	drawImage(img: CanvasImageSource,
		sx: number, sy: number, sw: number, sh: number,
		dx: number, dy: number, dw: number, dh: number
	): void;
	drawImage(img: CanvasImageSource,
		sx: number, sy: number, sw?: number, sh?: number,
		dx?: number, dy?: number, dw?: number, dh?: number
	) {
		//@ts-ignore
		if(dx !== undefined) return this.ctx.drawImage(img, sx, sy, sw, sh, dx-this.camera.x, dy-this.camera.y, dw, dh);
		//@ts-ignore
		else return this.ctx.drawImage(img, sx-this.camera.x, sy-this.camera.y, sw, sh);
	}
	getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings) {
		return this.ctx.getImageData(sx-this.camera.x, sy-this.camera.y, sw, sh, settings);
	}
	putImageData(imagedata: ImageData, dx: number, dy: number) {
		return this.ctx.putImageData(imagedata, dx-this.camera.x, dy-this.camera.y);
	}
	createImageData(...args: Parameters<typeof this.ctx.createImageData>) { return this.ctx.createImageData(...args); }
	getContextAttributes() { return this.ctx.getContextAttributes(); }
	setLineDash(segments: number[]) { return this.ctx.setLineDash(segments); }
	getLineDash() { return this.ctx.getLineDash(); }
	closePath() { return this.ctx.closePath(); }
	moveTo(x: number, y: number) { return this.ctx.moveTo(x-this.camera.x, y-this.camera.y); }
	lineTo(x: number, y: number) { return this.ctx.lineTo(x-this.camera.x, y-this.camera.y); }
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
		return this.ctx.quadraticCurveTo(cpx-this.camera.x, cpy-this.camera.y, x-this.camera.x, y-this.camera.y);
	}
	bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
		return this.ctx.bezierCurveTo(
			cp1x-this.camera.x, cp1y-this.camera.y,
			cp2x-this.camera.x, cp2y-this.camera.y,
			x-this.camera.x, y-this.camera.y
		);
	}
	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
		return this.ctx.arcTo(x1-this.camera.x, y1-this.camera.y, x2-this.camera.x, y2-this.camera.y, radius);
	}
	rect(x: number, y: number, w: number, h: number) { return this.ctx.rect(x-this.camera.x, y-this.camera.y, w, h); }
	arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean) {
		return this.ctx.arc(x-this.camera.x, y-this.camera.y, radius, startAngle, endAngle, counterclockwise);
	}
	ellipse(
		x: number, y: number,
		radiusX: number, radiusY: number,
		rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean
	) {
		return this.ctx.ellipse(
			x-this.camera.x, y-this.camera.y,
			radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise
		);
	}
};
