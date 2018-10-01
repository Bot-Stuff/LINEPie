module.exports = class {
	constructor(options = {}) {
		const inputType = typeof options;

		if (inputType !== 'object') throw `EventEmitter options needs to be an Object, recived ${inputType}`;
		this._emitDelay = options.emitDelay || false;
		this._maxListeners = options.maxListeners || Infinity;
		this._strictMode = options.strictMode || false;
		this.__events = [];
		this._listeners = {};
	}

	on(event, eventFunction) {
		this._addListener(event, eventFunction);
	}

	once(event, eventFunction) {
		this._addListener(event, eventFunction, true);
	}

	emit(event, ...eventArguments) {
		if (this._emitDelay) setTimeout(() => this._emit(event, ...eventArguments), this._emitDelay);
		else this._emit(event, eventArguments);
	}

	_addListener(event, eventFunction, once = false) {
		if (typeof eventFunction !== 'function') throw TypeError('Listener must be a function');
		if (this.__events.includes(event)) {
			if (this._listeners[event].length > this._maxListeners) throw RangeError(`Max listeners for the event: ${event} exceed. Current limit: ${this._maxListeners}`);
			this._listeners[event].push({ eventFunction, once });
		} else {
			this._listeners[event] = [{ eventFunction, once }];
			this.__events.push(event);
		}
	}

	_emit(event, eventArguments) {
		const functions = this._listeners[event];

		if (functions && functions.length) {
			for (const [index, { eventFunction, once }] of functions.entries()) {
				eventFunction(...eventArguments);
				if (once) this.removeListener(event, eventFunction);
			}
		}
		else if (this._strictMode) throw `There are no listeners for the specified for event: ${event}`;
	}

	removeListener(event, eventFunctionToRemove) {
		if (this.__events.includes(event)) {
			if (eventFunctionToRemove) for (const [index, { eventFunction }] of this._listeners[event].entries()) if (eventFunctionToRemove === eventFunction) this._listeners[event].splice(index, 1);
			 else {
				delete this._listeners[event];
				this.__events.splice(this.__events.indexOf(event), 1);
			}
		} else if (this._strictMode) throw new Error(`${event} doesn't exists`);
	}

	reset() {
		this.__events = [];
		this._listeners = {};
	}
};
