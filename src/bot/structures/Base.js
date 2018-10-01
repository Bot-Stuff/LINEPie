const util = require('util');

module.exports = class {
	constructor(id) {
		if (id) {
			this.id = id;
		}
	}

	get createdAt() {
		return Date.now();
	}

	toString() {
		let ID = '';
		if (this.id) {
			ID = ` ${this.id}`;
		} else if (this.user) {
			ID = ` ${this.user.id}`;
		}

		return `[${this.constructor.name}${ID}]`;
	}

	toJSON(simple) {
		if (simple) {
			return { id: this.id };
		}

		const base = {};
		for (const key in this) {
			if (!base.hasOwnProperty(key) && this.hasOwnProperty(key) && !key.startsWith('_')) {
				if (!this[key]) {
					base[key] = this[key];
				} else if (this[key] instanceof Set) {
					base[key] = Array.from(this[key]);
				} else if (this[key] instanceof Map) {
					base[key] = Array.from(this[key].values());
				} else if (typeof this[key].toJSON === 'function') {
					base[key] = this[key].toJSON();
				} else {
					base[key] = this[key];
				}
			}
		}
		return base;
	}

	[util.inspect.custom]() {
		const copy = new { [this.constructor.name]: class {} }[this.constructor.name]();
		for (const key in this) {
			if (this.hasOwnProperty(key) && !key.startsWith('_') && this[key] !== undefined) {
				copy[key] = this[key];
			}
		}
		return copy;
	}
};
