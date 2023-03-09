/*
import ts, { transpile, ModuleKind, ModuleResolutionKind, ScriptTarget } from 'typescript';


const tsconfig = {
    strict: true,
	target: ScriptTarget.ESNext,
	module: ModuleKind.ESNext,
	experimentalDecorators: true,
    useDefineForClassFields: true,
    lib: ['ESNext'],
    moduleResolution: ModuleResolutionKind.NodeNext,
	strictFunctionTypes: true,
    resolveJsonModule: true,
    isolatedModules: true,
    esModuleInterop: true,
    noEmit: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    noImplicitReturns: true,
	noImplicitAny: true,
    skipLibCheck: true,
    sourceMap: true,
	// baseUrl: '.',
    // paths: {
    //   '@/*': ['src/*']
    // }
};

const scripts: Record<string, string> = {};

const env = {
	console, Math, Object, Array,

	o: {
		_arr: [],
		getArr() { return this._arr; }
	}
};


fetch('/scripts/main.ts').then(data => data.text()).then(data => {
	scripts['main'] = data;

	const code = transpile(scripts['main'], tsconfig, 'main', [{
		source: 'main.filr',

		category: ts.DiagnosticCategory.Error,
		code: 0,
		start: 0,
		length: 5,
		messageText: 'sslwwakskw',
		file: ts.createSourceFile('main', 'main', ts.ScriptTarget.ESNext)
	}]);

	console.log(code);

	eval(code);
	// codeShell(code, env).call(env);
});



// const at = performance.now();
//
// o.update();
//
// const bt = performance.now();
//
// console.log(bt - at);

*/
export default 0;
