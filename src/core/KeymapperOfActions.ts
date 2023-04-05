//TODO: добавить mode, удаление, флаги перезаписываемочти и т.д.
import { EventDispatcher, Event } from '@/core/events';
import type { KeyboardInputInterceptor } from '@/core/KeyboardInputInterceptor';


type mapping_t = string[];
type action_t = (...args: any[]) => any;
type handler_t = (e: KeyboardInputInterceptor.Event) => any;


const isPartialMatching = (acc: mapping_t, mapping: mapping_t): boolean => {
	if(acc.length > mapping.length) return false;

	for(let i = 0; i < acc.length; i++) {
		if(acc[i] !== mapping[i]) return false;
	}

	return true;
};

const isFullMatching = (acc: mapping_t, mapping: mapping_t) => acc.length === mapping.length && isPartialMatching(acc, mapping);


interface IMapping {
	mapping: mapping_t,
	action: action_t;
}


export class Mapping implements IMapping {
	constructor(
		public mapping: mapping_t,
		public action: action_t
	) {}
}


export class KeymapperOfActions extends EventDispatcher {
	public '@init' = new Event<KeymapperOfActions, []>(this);
	public '@destroy' = new Event<KeymapperOfActions, []>(this);
	public '@enable' = new Event<KeymapperOfActions, []>(this);
	public '@disable' = new Event<KeymapperOfActions, []>(this);

	public '@reqister' = new Event<KeymapperOfActions, [mapping_t, action_t]>(this);

	protected keyboardInputInterceptor!: KeyboardInputInterceptor;

	// public mode: number = 0;
	public maps: IMapping[] = [];
	public mapping: IMapping | null = null;
	public timeoutlen: number = 2000;

	public timeout: number = this.timeoutlen;
	private isTimeRun: boolean = true;
	private acc: string[] = [];

	private _isActive: boolean = false;
	public get isActive(): boolean { return this._isActive; }

	private handler!: handler_t;

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

			this.acc.push(e.key);

			const mappings = this.maps.filter(i => isPartialMatching(this.acc, i.mapping));
			if(!mappings.length) return this.resetAcc();


			const mapping = mappings.find(i => this.acc.length === i.mapping.length) || null;
			this.mapping = mapping;

			if(mapping && mappings.length === 1) {
				mapping.action.call(null);
				this.resetAcc();
			} else if(!mapping) this.isTimeRun = false;

			console.log(JSON.stringify(this.acc), JSON.stringify(mapping));
		};

		this.keyboardInputInterceptor.on('keydown:input', this.handler);

		this.emit('init');
	}

	public destroy(this: KeymapperOfActions): void {
		this.keyboardInputInterceptor.off('keydown:input', this.handler);

		this.emit('disable');
	}

	public reqister(this: KeymapperOfActions, mapping: mapping_t, action: action_t): void {
		const collision = this.maps.find(i => isFullMatching(i.mapping, mapping));

		if(collision) collision.action = action;
		else this.maps.push(new Mapping(mapping, action));

		this.emit('reqister', mapping, action);
	}

	public update(dt: number): void {
		if(!this._isActive) return;

		if(this.acc.length && this.isTimeRun) this.timeout -= dt;

		if(this.timeout < 0) {
			if(this.mapping) this.mapping.action.call(null);

			this.resetAcc();
			this.resetTimer();
		}
	}
}
