import Koa from 'koa';
import DuckWebKoa from "../duck-web-koa";

declare namespace DuckWebKoaSession {
	type Install = (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => Koa<Koa.DefaultState, Koa.DefaultContext>;

	interface Options {
		key: string;
		install: Function;
		get: Function;
		set: Function;
		destory: Function;
	}

	interface Session extends Object {///fix this!!!
		[index: string]: any;
	}
}

declare module '@produck/duck-web-koa' {
	interface DuckWebKoaInjection {
		/**
		 * Web Application Factory Manager
		 */
		Session: DuckWebKoaSession.Install;
	}
}

declare module 'koa' {
	interface ExtendableContext {
		/**
		 * Web Application Factory Manager
		 */
		session: DuckWebKoaSession.Session;
	}
}

declare function DuckWebKoaSession(options?: DuckWebKoaSession.Options): DuckWebKoa.Plugin;

export = DuckWebKoaSession;