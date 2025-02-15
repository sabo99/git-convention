const { existsSync, mkdirSync, copyFileSync, readFileSync } = require("fs");
const Preparation = require("../../src/main/preparation");

jest.mock("fs");
jest.mock("../../src/utils");

describe("Preparation", () => {
	let options, config;

	console.log = jest.fn();
	console.error = jest.fn();

	config = {
		Paths: {
			COMMITLINT: {
				source: "commitlint/config",
				dest: "path/to/dest/commitlint/config"
			},
			HUSKY: {
				source: "husky/hooks",
				dest: "path/to/dest/husky/hooks"
			}
		},
		Files: {
			HUSKY_HOOKS: ["pre-commit", "commit-msg"]
		}
	};

	options = {
		config,
		packageRoot: "/path/from/package"
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("#exec", () => {
		it("should create directories and copy commitlint config if it exists", () => {
			existsSync.mockReturnValueOnce(true);
			const preparation = new Preparation(options);

			preparation.exec();

			expect(existsSync).toHaveBeenCalledWith(
				"\\path\\from\\package\\commitlint\\config"
			);
			expect(mkdirSync).toHaveBeenCalledWith("path/to/dest/commitlint", {
				recursive: true
			});
			expect(copyFileSync).toHaveBeenCalledWith(
				"\\path\\from\\package\\commitlint\\config",
				"path/to/dest/commitlint/config"
			);
		});

		it("should skip copying commitlint config if it does not exist", () => {
			existsSync.mockReturnValueOnce(false);
			const preparation = new Preparation(options);

			preparation.exec();

			expect(existsSync).toHaveBeenCalledWith("\\path\\from\\package\\commitlint\\config");
			expect(copyFileSync).not.toHaveBeenCalled();
		});

		it("should create directories and copy husky hooks if they exist", () => {
			existsSync
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(false);
			readFileSync
				.mockReturnValueOnce("hook content")
				.mockReturnValueOnce("hook content");
			const preparation = new Preparation(options);

			preparation.exec();

			expect(existsSync).toHaveBeenNthCalledWith(
				1,
				"\\path\\from\\package\\commitlint\\config"
			);
			expect(existsSync).toHaveBeenNthCalledWith(2, "path/to/dest/commitlint");
			expect(existsSync).toHaveBeenNthCalledWith(3, "path/to/dest/husky/hooks");
			expect(mkdirSync).toHaveBeenCalledWith("path/to/dest/husky/hooks", {
				recursive: true
			});
		});

		it("should skip copying husky hooks if they do not exist", () => {
			existsSync.mockReturnValueOnce(false);
			const preparation = new Preparation(options);

			preparation.exec();

			expect(existsSync).toHaveBeenNthCalledWith(
				1,
				"\\path\\from\\package\\commitlint\\config"
			);
			expect(existsSync).toHaveBeenNthCalledWith(2, "path/to/dest/husky/hooks");
			expect(existsSync).toHaveBeenNthCalledWith(
				3,
				"\\path\\from\\package\\husky\\hooks\\pre-commit"
			);
			expect(existsSync).toHaveBeenNthCalledWith(
				4,
				"\\path\\from\\package\\husky\\hooks\\commit-msg"
			);
			expect(copyFileSync).not.toHaveBeenCalled();
		});

		it("should log an error if copying a file fails", () => {
			console.error = jest.fn();
			const errorMessage = "Permission denied";
			existsSync.mockReturnValueOnce(true);
			mkdirSync.mockImplementationOnce(() => {
				throw new Error(errorMessage);
			});
			const preparation = new Preparation(options);

			preparation.exec();

			expect(console.error).toHaveBeenCalledWith(
				"❌ Error copying \\path\\from\\package\\commitlint\\config to path/to/dest/commitlint/config:",
				errorMessage
			);
		});

		it("should skip copying husky hook if destination file has the same content", () => {
			existsSync
				.mockReturnValueOnce(true) // commitlint config exists
				.mockReturnValueOnce(true) // commitlint dest exists
				.mockReturnValueOnce(true) // husky dest exists
				.mockReturnValueOnce(true) // husky hook src exists
				.mockReturnValueOnce(true); // husky hook dest exists
			readFileSync
				.mockReturnValueOnce("hook content") // husky hook src content
				.mockReturnValueOnce("hook content"); // husky hook dest content
			const preparation = new Preparation(options);

			preparation.exec();

			expect(existsSync).toHaveBeenNthCalledWith(
				1,
				"\\path\\from\\package\\commitlint\\config"
			);
			expect(existsSync).toHaveBeenNthCalledWith(2, "path/to/dest/commitlint");
			expect(existsSync).toHaveBeenNthCalledWith(3, "path/to/dest/husky/hooks");
			expect(existsSync).toHaveBeenNthCalledWith(
				4,
				"\\path\\from\\package\\husky\\hooks\\pre-commit"
			);
			expect(existsSync).toHaveBeenNthCalledWith(
				5,
				"path\\to\\dest\\husky\\hooks\\pre-commit"
			);
			expect(readFileSync).toHaveBeenNthCalledWith(
				1,
				"\\path\\from\\package\\husky\\hooks\\pre-commit",
				"utf8"
			);
			expect(readFileSync).toHaveBeenNthCalledWith(
				2,
				"path\\to\\dest\\husky\\hooks\\pre-commit",
				"utf8"
			);
			expect(console.log).toHaveBeenCalledWith(
				"✔ Skipped: pre-commit already up to date."
			);
			expect(copyFileSync).toHaveBeenCalledWith(
				"\\path\\from\\package\\commitlint\\config",
				"path/to/dest/commitlint/config"
			);
		});

		it("should copy file successfully", () => {
			existsSync.mockReturnValueOnce(false);
			const preparation = new Preparation(options);

			preparation._copyFile("path/to/source", "path/to/dest");

			expect(mkdirSync).toHaveBeenCalledWith("path/to", { recursive: true });
			expect(copyFileSync).toHaveBeenCalledWith(
				"path/to/source",
				"path/to/dest"
			);
			expect(console.log).toHaveBeenCalledWith(
				"✔ Copied: path/to/source -> path/to/dest"
			);
		});

		it("should log an error if copying file fails", () => {
			const errorMessage = "Permission denied";
			existsSync.mockReturnValueOnce(false);
			mkdirSync.mockImplementationOnce(() => {
				throw new Error(errorMessage);
			});
			const preparation = new Preparation(options);

			preparation._copyFile("path/to/source", "path/to/dest");

			expect(console.error).toHaveBeenCalledWith(
				"❌ Error copying path/to/source to path/to/dest:",
				errorMessage
			);
		});
	});
});
