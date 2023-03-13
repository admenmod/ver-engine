import { Vector2 } from '@/core/Vector2';


export const random = (a: number, b: number): number => Math.floor(Math.random()*(1+b-a)+a);
export const JSONcopy = <T extends object = object>(data: T): T => JSON.parse(JSON.stringify(data));

type Image = HTMLImageElement;

type cb_t = (ctx: CanvasRenderingContext2D, size: Vector2) => void;

type loadScript_p_t = {
	parent?: HTMLElement;
	async?: boolean;
};

type generateImage_t = ((w: number, h: number, cb: cb_t) => Promise<Image>) & {
	canvas?: HTMLCanvasElement;
};

export const generateImage: generateImage_t = (w, h, cb) => new Promise((res, rej) => {
	const cvs: HTMLCanvasElement = generateImage.canvas || (generateImage.canvas = document.createElement('canvas'));
	const ctx: CanvasRenderingContext2D = cvs.getContext('2d')!;
	cvs.width = w; cvs.height = h;

	cb(ctx, new Vector2(w, h));

	let img = new Image(w, h);
	img.src = cvs.toDataURL();
	img.onload = e => res(img);
	img.onerror = e => rej(e);
});

export const loadImage = (src: string, w: number, h: number): Promise<Image> => new Promise((res, rej) => {
	const el = new Image(w, h);
	el.src = src;
	el.onload = e => res(el);
	el.onerror = e => rej(e);
});

export const loadScript = (src: string, p: loadScript_p_t = {}): Promise<Event> => new Promise((res, rej) => {
	const parent: HTMLElement = p.parent || document.querySelector('head')!;

	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = p.async || false;
	script.src = src;

	parent.append(script);

	script.onload = e => res(e);
	script.onerror = e => rej(e);
});

let loader = { loadImage, loadScript, cache: new WeakMap() };
