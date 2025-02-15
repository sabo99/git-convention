import Deinitialization from "../../src/main/deinitialization";
const { execSync } = require("node:child_process");

jest.mock("node:child_process");

describe("Deinitialization", () => {
	let options, config, state;

	beforeEach(() => {
		state = {
			get: jest.fn().mockReturnValue({ skip: true }),
			delete: jest.fn()
		};
		config = {
			Commands: {
				NPM_PACKAGES: [{ command: "npm uninstall package", options: {} }]
			},
			State: state
		};

		options = {
			config
		};
	});

	describe("#exec", () => {
		it("should invoke State when state.get.skip is true", () => {
			const deinitialization = new Deinitialization(options);
			deinitialization.exec();

			expect(config.State.get).toHaveBeenCalledWith("HUSKY");
      expect(execSync).not.toHaveBeenCalled();
			expect(config.State.delete).toHaveBeenCalled();
		});

		it("should invoke State when state.get.skip is false", () => {
			const deinitialization = new Deinitialization({
				...options,
				config: {
					...options.config,
					State: {
						...options.config.State,
						get: jest.fn().mockReturnValue({ skip: false })
					}
				}
			});
			deinitialization.exec();

      expect(execSync).toHaveBeenLastCalledWith(config.Commands.NPM_PACKAGES[0].command, {});
			expect(config.State.delete).toHaveBeenCalled();
		});
	});
});
