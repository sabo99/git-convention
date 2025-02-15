const Initialization = require("./initialization");
const Preparation = require("./preparation");
const Deinitialization = require("./deinitialization");
const { throwIfMissing } = require("../utils");

class Runtime {
	/**
	 * Creates an instance of the Runtime class.
	 *
	 * @param {Object} options - The options for the Runtime instance.
	 * @param {Object} options.config - The configuration object (required).
	 * @param {string} options.packageRoot - The root directory of the package (required).
	 * @param {string} options.projectRoot - The root directory of the project (required).
	 * @throws Will throw an error if any of the required options are missing.
	 */
	constructor(options) {
		const requiredOptions = ["config", "packageRoot", "projectRoot"];
		requiredOptions.forEach((option) =>
			throwIfMissing(options[option], `options.${option} is required`)
		);
		Object.assign(this, options);
	}

	_execInitialization() {
		new Initialization({
			config: this.config,
			packageRoot: this.packageRoot,
			projectRoot: this.projectRoot
		}).exec();
	}

	_execPreparation() {
		new Preparation({
			config: this.config,
			packageRoot: this.packageRoot
		}).exec();
	}

	_execDeinitialization() {
		new Deinitialization({ config: this.config }).exec();
	}

	/**
	 * Executes the main runtime logic.
	 *
	 * This method performs the following steps:
	 * 1. Executes initialization logic and determines if initialization should be skipped.
	 * 2. Executes preparation logic.
	 * 3. If initialization is not skipped, executes deinitialization logic.
	 *
	 * @returns {void}
	 */
	exec() {
		this._execInitialization();
		this._execPreparation();
		this._execDeinitialization();
	}
}

module.exports = Runtime;
