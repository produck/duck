import DuckWebKoa from "../duck-web-koa";

declare namespace DuckWebKoaSession {
	interface Options {
		key: string;
		install: Function;
		get: Function;
		set: Function;
		destory: Function;
	}
}

declare function DuckWebKoaSession(options?: DuckWebKoaSession.Options): DuckWebKoa.Plugin;

export = DuckWebKoaSession;