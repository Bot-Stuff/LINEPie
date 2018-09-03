module.exports = class {
	constructor(options = {}) {
		const inputType = typeof options;

		if (inputType !== 'object') throw `EventEmitter options needs to be an Object, recived ${inputType}`;
		this._emitDelay = options.emitDelay || null;
		this._maxListeners = options.maxListeners || Infinity;
		this._strictMode = options.strictMode || false;
		this.events = [];
		this._listeners = {};
	}

	on(event, eventFunction) {
		this._addListenner(event, eventFunction);
	}

	once(event, eventFunction) {
		this._addListenner(event, eventFunction, true);
	}

	emit(event, ...eventArguments) {
		if (this._emitDelay) setTimeout(() => this._emit(event, ...eventArguments), this._emitDelay);
		else this._emit(event, eventArguments);
	}

	_addListenner(event, eventFunction, once = false) {
		if (typeof eventFunction !== 'function') throw TypeError('Listener must be a function');
		if (this.events.includes(event)) {
			if (this._listeners[event].length > this._maxListeners) throw RangeError(`Max listeners for the event: ${event} exceed. Current limit: ${this._maxListeners}`);
			this._listeners[event].push({ eventFunction, once });
		} else {
			this._listeners[event] = [{ eventFunction, once }];
			this.events.push(event);
		}
	}

	_emit(event, eventArguments) {
		const functions = this._listeners[event];
		if (!functions || functions.length === 0) {
			if (this._strictMode) throw `There are no listeners for the specified for event: ${event}`;
			return;
		}

		for (const [index, { eventFunction, once }] of functions.entries()) {
			eventFunction(...eventArguments);
			if (once) this._listeners[event].splice(index, 1);
		}

	}

	removeListenner(event, eventFunctionToRemove) {
		if (this.events.includes(event)) {
			if (eventFunctionToRemove) for (const [index, { eventFunction }] of this._listeners[event].entries()) if (eventFunctionToRemove === eventFunction) this._listeners[event].splice(index, 1);
			 else {
				delete this._listeners[event];
				this.events.splice(this.events.indexOf(event), 1);
			}
		} else if (this._strictMode) throw new Error(`${event} doesn't exists`);
	}

	reset() {
		this.events = [];
		this._listeners = {};
	}
};
