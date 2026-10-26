// @ts-nocheck

import * as matchers from 'jest-extended';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

expect.extend(matchers);
const observe = jest.fn();

beforeEach(() => {
	// Suites running under `@jest-environment node` have no window.
	if (typeof window === 'undefined') return;
	//Fixing jest-axe error
	//https://github.com/NickColley/jest-axe/issues/147
	const { getComputedStyle } = window;
	window.getComputedStyle = elt => getComputedStyle(elt);
	window.IntersectionObserver = jest.fn(function () {
		this.observe = observe;
	});
});
