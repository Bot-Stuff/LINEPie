module.exports = class {
	static get(structure) {
		return structures[structure];
	}

	static extend(structure, extender) {
		const extended = extender(structures[structure]);
		structures[structure] = extended;
		return extended;
	}
};

const structures = {
	Message: require('../bot/structures/Message'),
	User: require('../bot/structures/User')
};
