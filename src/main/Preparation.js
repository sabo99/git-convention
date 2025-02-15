const { existsSync, mkdirSync, copyFileSync, readFileSync } = require("fs");
const { dirname, join } = require("path");
const { throwIfMissing } = require("../utils");

/**
 * Class representing the preparation of configurations.
 */
class Preparation {
	/**
	 * Creates an instance of the Preparation class.
	 *
	 * @constructor
	 * @param {Object} options - The configuration options.
	 * @param {object} options.config - The configuration object.
   * @param {string} options.packageRoot - The root directory of the package.
	 * @throws Will throw an error if any of the required options are missing.
	 */
	constructor(options) {
    throwIfMissing(options, "options is required");
		throwIfMissing(options.config, "options.config is required");
		throwIfMissing(options.packageRoot, "options.packageRoot is required");

		Object.assign(this, options);
	}

	_ensureDirectoryExists(path) {
		if (!existsSync(path)) {
			mkdirSync(path, { recursive: true });
		}
	}

	_copyFile(src, dest) {
		try {
			this._ensureDirectoryExists(dirname(dest));
			copyFileSync(src, dest);
			console.log(`✔ Copied: ${src} -> ${dest}`);
		} catch (error) {
			console.error(`❌ Error copying ${src} to ${dest}:`, error.message);
		}
	}

	_setupCommitlint() {
		const { Paths } = this.config;
		const { source, dest: commitlintDest } = Paths.COMMITLINT;
    const commitlintSrc = join(this.packageRoot, source);

		if (existsSync(commitlintSrc)) {
			this._copyFile(commitlintSrc, commitlintDest);
		} else {
			console.warn("⚠ Commitlint config not found, skipping.");
		}
	}

	_setupHuskyHooks() {
		const { Paths, Files } = this.config;
		const { source, dest: huskyDest } = Paths.HUSKY;
    const huskySrc = join(this.packageRoot, source);

		this._ensureDirectoryExists(huskyDest);

		const hooks = Files.HUSKY_HOOKS;
		hooks.forEach((hook) => {
			const srcPath = join(huskySrc, hook);
			const destPath = join(huskyDest, hook);

			if (existsSync(srcPath)) {
				// Check if destination file exists and has the same content
				if (existsSync(destPath)) {
					const srcContent = readFileSync(srcPath, "utf8").trim();
					const destContent = readFileSync(destPath, "utf8").trim();

					if (srcContent === destContent) {
						console.log(`✔ Skipped: ${hook} already up to date.`);
						return;
					}
				}

				this._copyFile(srcPath, destPath);
			} else {
				console.warn(`⚠ Husky hook "${hook}" not found, skipping.`);
			}
		});
	}

	/**
	 * Executes the preparation steps for commitlint and husky hooks.
	 *
	 * @returns {void}
	 */
	exec() {
		this._setupCommitlint();
		this._setupHuskyHooks();
	}
}

module.exports = Preparation;
