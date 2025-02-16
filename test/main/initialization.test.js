const { execSync } = require('node:child_process');
const { existsSync } = require('fs');
const Initialization = require('../../src/main/initialization');

jest.mock('node:child_process');
jest.mock('fs');
jest.mock('../../src/utils');

describe('Initialization', () => {
	let config, options;

	beforeEach(() => {
		config = {
			Commands: {
				INSTALL_DEV_DEPEDENCIES: { command: 'npm install', options: {} },
				HUSKY_INIT: { command: 'npx husky-init', options: {} }
			},
			Paths: {
				HUSKY: { dest: '.husky' }
			},
			State: {
				set: jest.fn()
			}
		};

		options = {
			config,
			packageRoot: '/path/to/package',
			projectRoot: '/path/to/project'
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('#exec', () => {
		it('should install devDependencies and initialize Husky', () => {
			existsSync.mockReturnValue(false);

			const initialization = new Initialization(options);
			initialization.exec();

			expect(execSync).toHaveBeenCalledWith(
				config.Commands.INSTALL_DEV_DEPEDENCIES.command,
				config.Commands.INSTALL_DEV_DEPEDENCIES.options
			);
			expect(execSync).toHaveBeenCalledWith(
				config.Commands.HUSKY_INIT.command,
				config.Commands.HUSKY_INIT.options
			);
			expect(config.State.set).toHaveBeenCalledWith('HUSKY', { skip: false });
		});

		it('should skip installing devDependencies if already installed', () => {
			options.packageRoot = options.projectRoot;
			existsSync.mockReturnValue(false);

			const initialization = new Initialization(options);
			initialization.exec();

			expect(execSync).not.toHaveBeenCalledWith(
				config.Commands.INSTALL_DEV_DEPEDENCIES.command,
				config.Commands.INSTALL_DEV_DEPEDENCIES.options
			);
			expect(execSync).toHaveBeenCalledWith(
				config.Commands.HUSKY_INIT.command,
				config.Commands.HUSKY_INIT.options
			);
			expect(config.State.set).toHaveBeenCalledWith('HUSKY', { skip: false });
		});

		it('should skip initializing Husky if already initialized', () => {
			existsSync.mockReturnValue(true);

			const initialization = new Initialization(options);
			initialization.exec();

			expect(execSync).toHaveBeenCalledWith(
				config.Commands.INSTALL_DEV_DEPEDENCIES.command,
				config.Commands.INSTALL_DEV_DEPEDENCIES.options
			);
			expect(execSync).not.toHaveBeenCalledWith(
				config.Commands.HUSKY_INIT.command,
				config.Commands.HUSKY_INIT.options
			);
			expect(config.State.set).toHaveBeenCalledWith('HUSKY', { skip: true });
		});
	});
});
