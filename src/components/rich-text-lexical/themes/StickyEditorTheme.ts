/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import baseTheme from './PlaygroundEditorTheme';

import type { EditorThemeClasses } from 'lexical';

import './StickyEditorTheme.module.css';

const theme: EditorThemeClasses = {
	...baseTheme,
	paragraph: 'StickyEditorTheme__paragraph',
};

export default theme;
