import '@produck/duck'
import DuckLog from '@produck/duck-log'

declare namespace Mock {

}

declare class Mock {
	constructor()

	test(): void
}

declare module '@produck/duck' {
	interface InstalledInjection {
		Mock: Mock,
		Foo: string
	}

	interface BaseInjection {
		Bar: string
	}
}

declare module '@produck/duck-log' {
	interface LogInjection {
		some: DuckLog.CategoryLogger
	}
}