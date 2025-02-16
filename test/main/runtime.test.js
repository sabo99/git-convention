const Runtime = require('../../src/main/runtime');
const Initialization = require('../../src/main/initialization');
const Preparation = require('../../src/main/preparation');
const Deinitialization = require('../../src/main/deinitialization');

jest.mock('../../src/main/initialization');
jest.mock('../../src/main/preparation');
jest.mock('../../src/main/deinitialization');

describe('Runtime', () => {
	let options;

	beforeEach(() => {
		options = {
			config: {},
			packageRoot: '/path/from/package',
			projectRoot: '/path/to/project'
		};
	});

	it('should throw an error if required options are missing', () => {
		expect(() => new Runtime({})).toThrow('options.config is required');
		expect(() => new Runtime({ config: {} })).toThrow(
			'options.packageRoot is required'
		);
		expect(
			() => new Runtime({ config: {}, packageRoot: '/path/to/package' })
		).toThrow('options.projectRoot is required');
	});

	it('should create an instance of Runtime with valid options', () => {
		const runtime = new Runtime(options);
		expect(runtime).toBeInstanceOf(Runtime);
		expect(runtime.config).toBe(options.config);
		expect(runtime.packageRoot).toBe(options.packageRoot);
		expect(runtime.projectRoot).toBe(options.projectRoot);
	});

	it('should execute initialization, preparation, and deinitialization', () => {
		const runtime = new Runtime(options);
		runtime._execInitialization = jest.fn();
		runtime._execPreparation = jest.fn();
		runtime._execDeinitialization = jest.fn();

		runtime.exec();

		expect(runtime._execInitialization).toHaveBeenCalled();
		expect(runtime._execPreparation).toHaveBeenCalled();
		expect(runtime._execDeinitialization).toHaveBeenCalled();
	});

	it('should call Initialization with correct parameters', () => {
		const runtime = new Runtime(options);
		runtime._execInitialization();
		expect(Initialization).toHaveBeenCalledWith({
			config: options.config,
			packageRoot: options.packageRoot,
			projectRoot: options.projectRoot
		});
	});

	it('should call Preparation with correct parameters', () => {
		const runtime = new Runtime(options);
		runtime._execPreparation();
		expect(Preparation).toHaveBeenCalledWith({
			config: options.config,
			packageRoot: options.packageRoot
		});
	});

	it('should call Deinitialization with correct parameters', () => {
		const runtime = new Runtime(options);
		runtime._execDeinitialization();
		expect(Deinitialization).toHaveBeenCalledWith({
			config: options.config
		});
	});
});
