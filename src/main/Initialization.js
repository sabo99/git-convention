const { execSync } = require("node:child_process");
const { existsSync } = require("fs");
const { throwIfMissing } = require("../utils");

class Initialization {
	/**
	 * Initializes a new instance of the class.
	 *
	 * @param {object} options - The options for initialization.
	 * @param {object} options.config - The configuration object.
	 * @param {string} options.packageRoot - The root directory of the package.
	 * @param {string} options.projectRoot - The root directory of the project.
	 * @throws Will throw an error if any of the required options are missing.
	 */
	constructor(options) {
		throwIfMissing(options, "options is required");
		throwIfMissing(options.config, "options.config is required");
		throwIfMissing(options.packageRoot, "options.packageRoot is required");
		throwIfMissing(options.projectRoot, "options.projectRoot is required");

		Object.assign(this, options);
	}

	_installDevDependencies() {
		const { Commands } = this.config;
		if (this.packageRoot !== this.projectRoot) {
			console.log("🔧 Installing devDependencies...");
			execSync(
				Commands.INSTALL_DEV_DEPEDENCIES.command,
				Commands.INSTALL_DEV_DEPEDENCIES.options
			);
		} else {
			console.log("✔ DevDependencies already installed, skipping.");
		}
	}

	_initializeHusky() {
		const { Paths, Commands, State } = this.config;

		if (existsSync(Paths.HUSKY.dest)) {
			console.log(
				"✔ .husky directory already exists, skipping initialization."
			);
      State.set("HUSKY", { skip: true });
		} else {
			console.log("🔧 Initializing Husky...");
			execSync(Commands.HUSKY_INIT.command, Commands.HUSKY_INIT.options);
      State.set("HUSKY", { skip: false });
		}
	}

	/**
	 * Executes the initialization process.
	 *
	 * This method performs two main tasks:
	 * 1. Installs development dependencies.
	 * 2. Initializes Husky for Git hooks.
	 *
	 * @returns {void}
	 */
	exec() {
		this._installDevDependencies();
		this._initializeHusky();
	}
}

module.exports = Initialization;
