import '@produck/duck'

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