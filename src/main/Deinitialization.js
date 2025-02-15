const { execSync } = require("node:child_process");
const { throwIfMissing } = require("../utils");

class Deinitialization {
	/**
	 * Representing the deinitialization process.
	 *
	 * @constructor
	 * @param {Object} options - The options for initialization.
	 * @param {Object} options.config - The configuration object. This parameter is required.
	 * @throws Will throw an error if any of the required options are missing.
	 */
	constructor(options) {
		throwIfMissing(options.config, "options.config is required");

		Object.assign(this, options);
	}

	_deletePackages() {
		const {
			Commands: { NPM_PACKAGES },
			State
		} = this.config;

		const huskyState = State.get("HUSKY");
		const { skip } = huskyState;
		if (skip) {
      console.log("✔ Skipped: deinitialization.");
			return;
		}

		console.log("🔧 Deinitialization process...");

		NPM_PACKAGES.forEach((deletePackage) => {
			execSync(deletePackage.command, deletePackage.options);
		});
	}

	_deleteState() {
		const { State } = this.config;
		State.delete();
	}

  /**
   * Executes the deinitialization process by deleting packages and state.
   *
   * @return {void}
   */
	exec() {
		this._deletePackages();
		this._deleteState();
	}
}

module.exports = Deinitialization;
