import { Vector2 } from '@/core/Vector2';
import { EventDispatcher, Event } from '@/core/events';
import { TouchesController } from '@/core/TouchesController';
import { CanvasLayer } from '@/core/CanvasLayer';
import { SensorCamera } from '@/scenes/nodes/SensorCamera';
import { MainLoop } from '@/core/MainLoop';
import { MainScene } from '@/scenes/MainScene';
import { Viewport } from '@/core/nodes/Viewport';
import { MapParser } from '@/core/MapParser';
import {
	b2Body, b2BodyDef, b2FixtureDef,
	b2Vec2, b2World, b2Shapes,
	b2Contacts, b2ContactImpulse, b2Manifold
} from '@/core/Box2DAliases';


export type LayersList = { [id: string]: CanvasRenderingContext2D };


export const appElement = document.querySelector<HTMLDivElement>('#app');
if(!appElement) throw new Error('app is not found');

export const canvas = new CanvasLayer();
appElement.append(canvas);


export const layers: LayersList = {};

for(let id in canvas.layers) {
	layers[id] = canvas.layers[id].getContext('2d')!;
}


export const touches = new TouchesController(canvas);

export const mapParser = new MapParser();


export const gm = new class GameManager extends EventDispatcher {
	public '@resize' = new Event<this, [Vector2]>(this);
	public '@camera.scale' = new Event<this, [Vector2]>(this);


	public screen = new Vector2(canvas.size);
	public camera = new SensorCamera(this.screen, 30);

	public readonly viewport = new Viewport(this.screen);
	public readonly root = this.viewport;


	constructor() {
		super();

		canvas['@resize'].on(size => {
			this.screen.set(size);
			this.camera.size.set(size);

			this['@resize'].emit(size);
		});


		this.camera['@scale'].on(scale => this['@camera.scale'].emit(scale));
	}
}


export const b2w = new class Box2DWrapper extends EventDispatcher {
	public '@BeginContact' = new Event<Box2DWrapper, [b2Contacts.b2Contact]>(this);
	public '@EndContact' = new Event<Box2DWrapper, [b2Contacts.b2Contact]>(this);
	public '@PostSolve' = new Event<Box2DWrapper, [b2Contacts.b2Contact, b2ContactImpulse]>(this);
	public '@PreSolve' = new Event<Box2DWrapper, [b2Contacts.b2Contact, b2Manifold]>(this);


	public gravity = new b2Vec2(0, 10);

	public world = new b2World(this.gravity, true);

	public bodyDef = new b2BodyDef();
	public fixtureDef = new b2FixtureDef();


	// public debugDraw = new Box2D.Dynamics.b2DebugDraw();


	public createBox(pos: Vector2, size: Vector2, rot: number, t: number): b2Body {
		const { bodyDef, fixtureDef, world } = this;

		fixtureDef.density = 1;
		fixtureDef.friction = 0.5; //0.5;
		fixtureDef.restitution = 0.2; //0.2;

		bodyDef.type = t;

		fixtureDef.shape = new b2Shapes.b2PolygonShape();
		(fixtureDef.shape as b2Shapes.b2PolygonShape).SetAsBox(size.x/2, size.y/2);

		bodyDef.position.Set(pos.x, pos.y);
		bodyDef.angle = rot;

		const body = world.CreateBody(bodyDef);
		body.CreateFixture(fixtureDef);

		return body;
	}

	public init(): void {
		const b2listner = new Box2D.Dynamics.b2ContactListener();


		b2listner.BeginContact = (contact: b2Contacts.b2Contact) => {
			this['@BeginContact'].emit(contact);
		};

		b2listner.EndContact = (contact: b2Contacts.b2Contact) => {
			this['@EndContact'].emit(contact);
		};

		b2listner.PostSolve = (contact: b2Contacts.b2Contact, impulse: b2ContactImpulse) => {
			this['@PostSolve'].emit(contact, impulse);
		};

		b2listner.PreSolve = (contact: b2Contacts.b2Contact, oldManifold: b2Manifold) => {
			this['@PreSolve'].emit(contact, oldManifold);
		};


		this.world.SetContactListener(b2listner);

		// const { debugDraw, world } = this;
		//
		// debugDraw.SetSprite(layers.back);
		// debugDraw.SetDrawScale(gm.camera.pixelDensity);
		// debugDraw.SetFillAlpha(0.5);
		// debugDraw.SetLineThickness(1.0);
		// debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
		//
		// world.SetDebugDraw(debugDraw);
	}

	public process(dt: number): void {
		this.world.Step(dt/1000, 10, 10);

		// const ctx = layers.main;
		//
		// ctx.save();
		// ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		// this.world.DrawDebugData();
		// ctx.restore();

		this.world.ClearForces();
	}
}



//@ts-ignore
canvas.ondblclick = () => canvas.webkitRequestFullscreen();

gm.root.addChild(new MainScene());
b2w.init();


const mainLoop = new MainLoop();

mainLoop.on('update', dt => {
	gm.root.process(dt);
	b2w.process(dt);
	gm.root.render(layers, gm.camera);

	touches.nullify();
});

mainLoop.start();

gm.root.ready();
