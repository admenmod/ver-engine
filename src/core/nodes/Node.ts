import { Event, EventEmitter } from "@/core/Event";
import { NodePath } from "@/core/NodePath";
import { getInstanceOf, isInstanceOf } from '@/core/types';
import { Camera } from "@/core/Camera";


export type LayersList = { [id: string]: CanvasRenderingContext2D };


export class Node extends EventEmitter {
	public '@init' = new Event<Node, []>(this);
	public '@exit' = new Event<Node, []>(this);
	public '@ready' = new Event<Node, []>(this);

	public '@process' = new Event<Node, [number]>(this);
	public '@render' = new Event<Node, [LayersList, Camera]>(this);

	public '@enter_tree' = new Event<Node, [Node, string]>(this);
	public '@exit_tree' = new Event<Node, [Node, string]>(this);


	public static readonly MAX_NESTING: number = 10000;

	public get NODE_TYPE(): string { return this.constructor.name; }


	private _name: string = this.NODE_TYPE;
	private _owner: Node | null = null;

	protected _parent_node: Node | null = null;
	protected _child_nodes: Node[] = [];


	private _isInited: boolean = false;
	private _isExited: boolean = false;
	private _isReady: boolean = false;


	constructor() {
		super();
	}

	public set name(v) { this._name = v; }
	public get name() { return this._name; }

	public get owner() { return this._owner; }
	public set owner(v) { this._owner = v; }


	public get isInited(): boolean { return this._isInited; }
	public get isExited(): boolean { return this._isExited; }
	public get isReady(): boolean { return this._isReady; }


	protected _enter_tree(node: Node, name: string): void {}
	protected _exit_tree(node: Node, name: string): void {}


	protected _init(): void {}
	protected _exit(): void {}

	protected async _ready(): Promise<void> {}
	protected _process(dt: number): void {}
	protected _render(layers: LayersList, camera: Camera): void {}


	public init(): void {
		if(!this._isReady || this._isInited) return;

		this._init();
		this._isInited = true;

		// const l = this.getCountChildren();
		// for(let i = 0; i < l; i++) this.getChild(i).init();

		(this as Node).emit('init');
	}

	public exit(): void {
		if(this._isExited) return;

		this._exit();
		this._isExited = true;

		const l = this.getCountChildren();
		for(let i = 0; i < l; i++) this.getChild(i).exit();

		(this as Node).emit('exit');
	}

	public async ready(): Promise<void> {
		if(this._isReady) return;

		await this._ready();

		const proms: Promise<void>[] = [];
		const l = this.getCountChildren();
		for(let i = 0; i < l; i++) proms.push(this.getChild(i).ready());
		

		await Promise.all(proms);

		this._isReady = true;

		this.init();

		(this as Node).emit('ready');
	}

	public process(dt: number): void {
		if(!this._isInited || !this._isReady) return;

		this._process(dt);

		const l = this.getCountChildren();
		for(let i = 0; i < l; i++) this.getChild(i).process(dt);

		(this as Node).emit('process', dt);
	}

	public render(layers: LayersList, camera: Camera): void {
		if(!this._isInited || !this._isReady) return;

		this._render(layers, camera);

		const l = this.getCountChildren();
		for(let i = 0; i < l; i++) this.getChild(i).render(layers, camera);

		(this as Node).emit('render', layers, camera);
	}



	public isInsideTree(): boolean { return Boolean(this._parent_node); }


		// getChild(path) {
		// 	let l = path.search('/');
		// 	if(!~l) return this._children.find(i => i.name === path);
		// 	
		// 	let left = path.slice(0, l);
		// 	let right = path.slice(l+1);
		// 	
		// 	return this.getChild(left).getChild(right);
		// }


	public getParent(): Node | null { return this._parent_node; }
	public getChainParents<T extends new(...args: any[]) => Node = typeof Node>(Class: T): getInstanceOf<T>[] {
		let arr: getInstanceOf<T>[] = [];
		let p: Node | null = this;

		for(let i = 0; (p = p.getParent()) && i < Node.MAX_NESTING; ++i) {
			if(isInstanceOf(p, Class)) arr.push(p);
		}

		return arr;
	}
	// public getRoot<T extends Node = Node>(): T {
	// 	return this.getNode('/root') as T;
	// }


	public hasChild(name: string): boolean {
		for(let i = 0; i < this._child_nodes.length; i++) {
			if(this._child_nodes[i].name === name) return true;
		}

		return false;
	}

	public hasNode(node: Node): boolean {
		for(let i = 0; i < this._child_nodes.length; ++i) {
			if(this._child_nodes[i] === node) return true;
		}

		return false;
	}

	public getCountChildren(): number { return this._child_nodes.length; }
	public getChild<T extends Node = Node>(index: number): T {
		return this._child_nodes[index] as T;
	}

	// TODO: make
	public getNode<T extends Node>(path: string): T | null {
		if(path[0] === '/') {
			const arr = this.getChainParents(Node);
			// console.log('ss', this.name, arr);

			return arr[arr.length-1] as T;
		}


		const nodepath = NodePath.from(path);

		for(let i = 0; i < this._child_nodes.length; i++) {
			if(this._child_nodes[i].name === nodepath.getName(0)) return this._child_nodes[i] as T;
		}

		return null;
	}

	public addChild<T extends Node>(node: T, name: string = node.name): T {
		if(this.hasChild(name)) throw new Error(`node with the same name "${name}" already exists`);
		if(node._parent_node) throw new Error(`this node has already been added to tree along the path "${node.getPath()}"`);

		node._parent_node = this;
		node.name = name;
		this._child_nodes.push(node);

		node._enter_tree(this, node.name);
		(node as Node).emit('enter_tree', this, node.name);

		return node;
	}

	public removeChild<T extends Node>(node: T): T {
		let l = this._child_nodes.indexOf(node);

		if(~l) console.error('this node is not a child');
		this._child_nodes.splice(l, 1);
		node._parent_node = null;

		node._exit_tree(this, node.name);
		(node as Node).emit('exit_tree', this, node.name);

		return node;
	}


	public getPath(): NodePath {
		let path = '';
		let p: Node | null = this;

		for(let i = 0; p && i < Node.MAX_NESTING; ++i) {
			path += '/'+p.name;
			p = p.getParent();
		}

		return new NodePath(path);
	}
}
