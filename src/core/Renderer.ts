import { EventDispatcher, Event } from '@/core/events';
import { Node } from '@/core/nodes/Node';


export class Renderer extends EventDispatcher {
	private static _this: Renderer;

	private nodes: Node[] = [];

	constructor() {
		if(Renderer._this) return Renderer._this;

		super();

		Renderer._this = this;
	}

	public registerNode(node: Node): void {
		this.nodes.push(node);
	}

	public checkReady(): void {
		for(const node of this.nodes) {
			// все ресурсы еще не загружены
			if(!node.isReady) return;
		}

		// все ресурсы загружены, начинаем отрисовывать узлы
		this.render();
	}

	private render(): void {
		// отрисовка всех узлов в порядке zindex
		// ...
	}
}

/*
class Node {
	private children: Node[] = [];
	private isLoaded = false;

	public addChild(child: Node): void {
		this.children.push(child);
		renderer.registerNode(child);
	}

	public ready(): void {
		this.loadResources(() => {
			this.isLoaded = true;
			renderer.checkReady();
		});
	}

	public process(dt: number): void {
		// обновление состояния узла
		// ...

		for (const child of this.children) {
			child.process(dt);
		}
	}

	public isReady(): boolean {
		// проверка, все ли ресурсы загружены
		// ...
	}
}

// Создание главного узла и добавление дочерних узлов
const root = new Node();
const child1 = new Node();
const child2 = new Node();
root.addChild(child1);
root.addChild(child2);

// Запуск процесса загрузки и отрисовки
root.ready();

*/
