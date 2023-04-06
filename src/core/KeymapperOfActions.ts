//TODO: добавить mode, удаление, флаги перезаписываемочти и т.д.
import type { KeyboardInputInterceptor } from '@/core/KeyboardInputInterceptor';
import { EventDispatcher, Event } from '@/core/events';

type mode_t = string | symbol;
type mapping_t = string[];
type action_t = (mapping: Mapping) => any;


const isPartialMatching = (acc: mapping_t, mapping: mapping_t): boolean => {
	if(acc.length > mapping.length) return false;

	for(let i = 0; i < acc.length; i++) {
		if(acc[i] !== mapping[i]) return false;
	}

	return true;
};

const isFullMatching = (acc: mapping_t, mapping: mapping_t) => acc.length === mapping.length && isPartialMatching(acc, mapping);


interface IMapping {
	mapping: mapping_t;
	action: action_t;
}


export class Mapping implements IMapping {
	constructor(
		public mapping: mapping_t,
		public action: action_t
	) {}
}


export namespace KeymapperOfActions {
	export type Action = action_t;
}

export class KeymapperOfActions extends EventDispatcher {
	public '@init' = new Event<KeymapperOfActions, []>(this);
	public '@destroy' = new Event<KeymapperOfActions, []>(this);
	public '@enable' = new Event<KeymapperOfActions, []>(this);
	public '@disable' = new Event<KeymapperOfActions, []>(this);

	public '@newmode' = new Event<KeymapperOfActions, [mode_t]>(this);
	public '@changemode' = new Event<KeymapperOfActions, [mode_t]>(this);
	public '@reqister' = new Event<KeymapperOfActions, [mode_t | 0, mapping_t, action_t]>(this);

	protected keyboardInputInterceptor!: KeyboardInputInterceptor;

	private mode: mode_t | null = null;
	public mapmap = new Map<mode_t, IMapping[]>();

	public gmaps: IMapping[] = [];
	public cmaps!: IMapping[];
	public mapping: IMapping | null = null;
	public timeoutlen: number = 1000;

	public timeout: number = this.timeoutlen;
	private isTimeRun: boolean = true;
	private acc: string[] = [];

	private _isActive: boolean = false;
	public get isActive(): boolean { return this._isActive; }

	private handler!: (e: KeyboardInputInterceptor.Event) => any;


	constructor(mode: mode_t, timeoutlen?: number) {
		super();

		if(timeoutlen) this.timeoutlen = timeoutlen;

		this.setMode(mode);
	}


	public resetAcc(): void { this.acc.length = 0; }
	public resetTimer(): void { this.timeout = this.timeoutlen; }

	public enable(this: KeymapperOfActions): void {
		this._isActive = true;
		this.emit('enable');
	}
	public disable(this: KeymapperOfActions): void {
		this._isActive = false;
		this.emit('disable');
	}

	public init(this: KeymapperOfActions, keyboardInputInterceptor: KeyboardInputInterceptor): void {
		this.keyboardInputInterceptor = keyboardInputInterceptor;

		this.handler = e => {
			this.isTimeRun = true;
			this.resetTimer();

			if(e.key === 'Escape') {
				this.resetAcc();
				return;
			}

			let metapref = '';
			if(e.ctrl) metapref += 'ctrl-';
			if(e.alt) metapref += 'alt-';

			this.acc.push(metapref+e.key);


			const maps = this.cmaps;

			const mappings = [
				...maps.filter(i => isPartialMatching(this.acc, i.mapping)),
				...this.gmaps.filter(i => isPartialMatching(this.acc, i.mapping))
			];

			if(!mappings.length) return this.resetAcc();


			const mapping = mappings.find(i => this.acc.length === i.mapping.length) || null;
			this.mapping = mapping;

			if(mapping && mappings.length === 1) {
				mapping.action.call(null, mapping);
				this.resetAcc();
			} else if(!mapping) this.isTimeRun = false;
		};

		this.keyboardInputInterceptor.on('keydown:input', this.handler);

		this.emit('init');
	}

	public destroy(this: KeymapperOfActions): void {
		this.keyboardInputInterceptor.off('keydown:input', this.handler);

		this.emit('disable');
	}

	public reqister(this: KeymapperOfActions, mode: mode_t | 0, mapping: mapping_t, action: action_t): void {
		if(mode !== 0 && !this.mapmap.has(mode)) return;

		let maps: IMapping[];
		if(mode === 0) maps = this.gmaps;
		else maps = this.mapmap.get(mode)!;

		const collision = maps.find(i => isFullMatching(i.mapping, mapping));

		if(collision) collision.action = action;
		else maps.push(new Mapping(mapping, action));

		this.emit('reqister', mode, mapping, action);
	}

	setMode(this: KeymapperOfActions, mode: mode_t) {
		if(!this.mapmap.has(mode)) {
			this.mapmap.set(mode, []);

			this.emit('newmode', mode);
		}

		this.mode = mode;
		this.cmaps = this.mapmap.get(this.mode)!;

		this.emit('changemode', mode);
	}

	public update(dt: number): void {
		if(!this._isActive) return;

		if(this.acc.length && this.isTimeRun) this.timeout -= dt;

		if(this.timeout < 0) {
			if(this.mapping) this.mapping.action.call(null, this.mapping);

			this.resetAcc();
			this.resetTimer();
		}
	}
}
