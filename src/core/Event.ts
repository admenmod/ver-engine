const isOnceSymbol = Symbol('isOnceSymbol');

type FnOnce<This, Args extends any[]> = ((this: This, ...args: Args) => any) & { [isOnceSymbol]?: boolean };


export class Event<This = any, Args extends any[] = any[]> {
	private _handlers: FnOnce<This, Args>[] = [];
	protected readonly _this: This;

	constructor(_this: This) { this._this = _this; }

	public on(fn: FnOnce<This, Args>) {
		this._handlers.push(fn);
	}

	public once(fn: FnOnce<This, Args>) {
		fn[isOnceSymbol] = true;
		this._handlers.push(fn);
	}

	public off(fn: FnOnce<This, Args>) {
		let l: number = this._handlers.indexOf(fn);
		if(~l) return;
		this._handlers.splice(l, 1);
	}

	public emit(...args: Args) {
		for(let i = 0; i < this._handlers.length; ++i) {
			const fn = this._handlers[i];
			fn.apply(this._this, args);
			if(fn[isOnceSymbol]) this.off(fn);
		}
	}

	public clear() {
		this._handlers.length = 0;
	}
}


type event_name<T extends string = string> = `@${T}`;

type KeysEvents<T extends object> = ({
	[K in keyof T]: T[K] extends Event ? K extends event_name ? K : never : never
})[keyof T];

type getEventArgs<T extends object, K extends KeysEvents<T>> =
	T[K] extends Event<any, infer A> ? A : never;

type ConvertDel<U extends event_name> = U extends event_name<infer R> ? R : never;
type ConvertAdd<U extends string> = event_name<U>;


type ArgsEvent<T extends object, Type extends ConvertDel<KeysEvents<T>>> =
	getEventArgs<T, ConvertAdd<Type> extends KeysEvents<T> ? ConvertAdd<Type> : never>;


export class EventEmitter {
	public on<
		Type extends ConvertDel<KeysEvents<this>>,
		Args extends ArgsEvent<this, Type>
	>(type: Type, fn: (this: this, ...args: Args) => any) {
		((this as any)[`@${type}`] as Event<this, Args>).on(fn);
	}

	public once<
		Type extends ConvertDel<KeysEvents<this>>,
		Args extends ArgsEvent<this, Type>
	>(type: Type, fn: (this: this, ...args: Args) => any) {
		((this as any)[`@${type}`] as Event<this, Args>).once(fn);
	}

	public off<
		Type extends ConvertDel<KeysEvents<this>>,
		Args extends ArgsEvent<this, Type>
	>(type: Type, fn: (this: this, ...args: Args) => any) {
		((this as any)[`@${type}`] as Event<this, Args>).off(fn);
	}

	public emit<
		Type extends ConvertDel<KeysEvents<this>>,
		Args extends ArgsEvent<this, Type>
	>(type: Type, ...args: Args) {
		((this as any)[`@${type}`] as Event<this, Args>).emit(...args);
	}

	public clear<Type extends ConvertDel<KeysEvents<this>>>(type: Type) {
		((this as any)[`@${type}`] as Event<this, any>).clear();
	}
}

// пример использования
class A extends EventEmitter {
	public '@init' = new Event<A, ['init param']>(this);
	public '@exit' = new Event<A, ['exit param']>(this);
	public '@update' = new Event<A, [number]>(this);
}

let a = new A();

a.emit('init', 'init param');
a.emit('exit', 'exit param');

a.on('update', function(dt) {
	dt; // type: number
	this; // type: A
});


a.off('exit', function(n) {
	n;
	this;
});


a.clear('init');
