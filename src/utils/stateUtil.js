const { BehaviorSubject } = require("rxjs");

let initialState = {};

const state$ = new BehaviorSubject(initialState);
const getState$ = (key) => state$.getValue()[key];
const setState$ = (key, value) => {
	initialState[key] = value;
	state$.next({ ...state$.getValue(), ...initialState });
};
const deleteState$ = () => {
	initialState = {};
	state$.next(initialState);
};

module.exports = {
	state$,
	getState$,
	setState$,
	deleteState$
};
