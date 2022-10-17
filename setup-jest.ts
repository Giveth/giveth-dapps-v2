// @ts-nocheck

import * as matchers from 'jest-extended';
import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';

expect.extend(matchers);

beforeEach(() => {
	//Fixing jest-axe error
	//https://github.com/NickColley/jest-axe/issues/147
	const { getComputedStyle } = window;
	window.getComputedStyle = elt => getComputedStyle(elt);
});
