const {
	state$,
	getState$,
	setState$,
	deleteState$
} = require("../../src/utils/stateUtil");

describe("stateUtil", () => {
	beforeEach(() => {
		deleteState$();
	});

	it("should initialize with an empty state", () => {
		expect(state$.getValue()).toEqual({});
	});

	it("should set and get state values", () => {
		setState$("key1", "value1");
		expect(getState$("key1")).toEqual("value1");
	});

	it("should update state values", () => {
		setState$("key1", "value1");
		setState$("key1", "value2");
		expect(getState$("key1")).toEqual("value2");
	});

	it("should delete state", () => {
		setState$("key1", "value1");
		deleteState$();
		expect(state$.getValue()).toEqual({});
	});

	it("should handle multiple keys", () => {
		setState$("key1", "value1");
		setState$("key2", "value2");
		expect(getState$("key1")).toEqual("value1");
		expect(getState$("key2")).toEqual("value2");
	});

	it("should not throw error when getting non-existent key", () => {
		expect(getState$("nonExistentKey")).toBeUndefined();
	});
});
