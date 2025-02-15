const { createPath, createCommand } = require("@utils");

describe("objectUtil", () => {
	describe("#createPath", () => {
		it("should create a path object with source and dest", () => {
			const source = "src";
			const dest = "dest";
			const result = createPath(source, dest);
			expect(result).toEqual({ source, dest });
		});
	});

	describe("#createCommand", () => {
		it("should create a command object with command and options", () => {
			const command = "npm install";
			const result = createCommand(command);
			expect(result).toEqual({ command, options: { stdio: "inherit" } });
		});
	});
});
