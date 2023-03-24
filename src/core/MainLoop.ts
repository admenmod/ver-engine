import { Event, EventDispatcher } from '@/core/events';


export class MainLoop extends EventDispatcher {
	public '@start' = new Event<MainLoop, []>(this);
	public '@stop' = new Event<MainLoop, []>(this);
	public '@update' = new Event<MainLoop, [number]>(this);

	public isEnabled: boolean;
	public prevTime: number;
	public maxDiff: number;
	public mindt: number;

	public dt!: number;


	constructor(p: any = {}) {
		super();

		this.isEnabled = false;
		this.prevTime = 0;
		this.maxDiff = p.maxDiff || 1000;
		this.mindt = p.mindt || 1000 / (p.fps || 120);
	}

	public start(): void {
		if(this.isEnabled) return;
		this.isEnabled = true;

		let _update = (currentTime: number): void => {
			if(!this.isEnabled) {
				(this as MainLoop).emit('stop');
				return;
			};

			this.dt = currentTime - this.prevTime;

			if(this.dt > this.mindt) {
				if(this.dt < this.maxDiff) (this as MainLoop).emit('update', this.dt);
				this.prevTime = currentTime;
			};

			requestAnimationFrame(_update);
		};

		requestAnimationFrame(_update);

		(this as MainLoop).emit('start');
	}

	public stop(): void {
		if(!this.isEnabled) return;
		this.isEnabled = false;
	}
};
