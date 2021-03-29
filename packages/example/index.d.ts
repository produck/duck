import '@produck/duck'
import '@produck/duck-log'
import { CategoryLogger } from '@produck/duck-log/src/CategoryLogger'

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
		some: CategoryLogger
	}
}