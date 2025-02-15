const throwIfMissing = (value, message) => {
	if (value === undefined || value === null) {
		throw new TypeError(message);
	}
};

module.exports = {
  throwIfMissing
};
