export class DuckLoggerRegistry {
	constructor() {
		this.map = new Map();

		this.proxy = new Proxy((...args) => this.register(...args), {
			get: (_target, categoryName) {
				if (!registry.has(categoryName)) {
					throw new Error(`Category logger(${categoryName}) is NOT defined.`);
				}

				return register.get(categoryName);
			},
			set: () => {
				throw new Error('Illegal setting property.');
			}
		});
	}

	register(category, options) {
		if (this.map.has(category)) {
			throw new Error(`The category logger(${category}) is existed.`);
		}

		registry[category] = Logger.Proxy(options);
	}
}