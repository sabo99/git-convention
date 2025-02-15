const utils = require("../utils");

module.exports = {
	Paths: {
		HUSKY: utils.createPath("./src/template/husky", ".husky/"),
		COMMITLINT: utils.createPath(
			"./src/template/commitlint/.commitlintrc.json",
			".commitlintrc.json"
		)
	},
	Commands: {
		INSTALL_DEV_DEPEDENCIES: utils.createCommand(
			"npm install -D husky @commitlint/cli @commitlint/config-conventional"
		),
		HUSKY_INIT: utils.createCommand("npx husky init"),
		NPM_PACKAGES: [utils.createCommand("npm pkg delete scripts.prepare")]
	},
	Files: {
		HUSKY_HOOKS: ["_/husky.sh", "commit-msg", "pre-commit", "pre-push"]
	},
  State: {
    get: utils.getState$,
    set: utils.setState$,
    delete: utils.deleteState$
  }
};
