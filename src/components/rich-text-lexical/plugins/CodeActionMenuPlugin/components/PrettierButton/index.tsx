/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $isCodeNode } from '@lexical/code';
import { $getNearestNodeFromDOMNode, LexicalEditor } from 'lexical';
import { Options } from 'prettier';
import { useState } from 'react';
import styles from './index.module.css';

interface Props {
	lang: string;
	editor: LexicalEditor;
	getCodeDOMNode: () => HTMLElement | null;
}
const PRETTIER_PARSER_MODULES = {
	css: [() => import('prettier/plugins/postcss')],
	html: [() => import('prettier/plugins/html')],
	js: [
		() => import('prettier/plugins/babel'),
		() => import('prettier/plugins/estree'),
	],
	markdown: [() => import('prettier/plugins/markdown')],
	typescript: [
		() => import('prettier/plugins/typescript'),
		() => import('prettier/plugins/estree'),
	],
} as const;

type LanguagesType = keyof typeof PRETTIER_PARSER_MODULES;

async function loadPrettierParserByLang(lang: string) {
	const dynamicImports = PRETTIER_PARSER_MODULES[lang as LanguagesType];
	const modules = await Promise.all(
		dynamicImports.map(dynamicImport => dynamicImport()),
	);
	return modules;
}

async function loadPrettierFormat() {
	const { format } = await import('prettier/standalone');
	return format;
}

const PRETTIER_OPTIONS_BY_LANG: Record<string, Options> = {
	css: { parser: 'css' },
	html: { parser: 'html' },
	js: { parser: 'babel' },
	markdown: { parser: 'markdown' },
	typescript: { parser: 'typescript' },
};

const LANG_CAN_BE_PRETTIER = Object.keys(PRETTIER_OPTIONS_BY_LANG);

export function canBePrettier(lang: string): boolean {
	return LANG_CAN_BE_PRETTIER.includes(lang);
}

function getPrettierOptions(lang: string): Options {
	const options = PRETTIER_OPTIONS_BY_LANG[lang];
	if (!options) {
		throw new Error(
			`CodeActionMenuPlugin: Prettier does not support this language: ${lang}`,
		);
	}

	return options;
}

export function PrettierButton({ lang, editor, getCodeDOMNode }: Props) {
	const [syntaxError, setSyntaxError] = useState<string>('');
	const [tipsVisible, setTipsVisible] = useState<boolean>(false);

	async function handleClick(): Promise<void> {
		const codeDOMNode = getCodeDOMNode();
		if (!codeDOMNode) {
			return;
		}

		let content = '';
		editor.update(() => {
			const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);
			if ($isCodeNode(codeNode)) {
				content = codeNode.getTextContent();
			}
		});
		if (content === '') {
			return;
		}

		try {
			const format = await loadPrettierFormat();
			const options = getPrettierOptions(lang);
			const prettierParsers = await loadPrettierParserByLang(lang);
			options.plugins = prettierParsers.map(
				parser => parser.default || parser,
			);
			const formattedCode = await format(content, options);

			editor.update(() => {
				const codeNode = $getNearestNodeFromDOMNode(codeDOMNode);
				if ($isCodeNode(codeNode)) {
					const selection = codeNode.select(0);
					selection.insertText(formattedCode);
					setSyntaxError('');
					setTipsVisible(false);
				}
			});
		} catch (error: unknown) {
			setError(error);
		}
	}

	function setError(error: unknown) {
		if (error instanceof Error) {
			setSyntaxError(error.message);
			setTipsVisible(true);
		} else {
			console.error('Unexpected error: ', error);
		}
	}

	function handleMouseEnter() {
		if (syntaxError !== '') {
			setTipsVisible(true);
		}
	}

	function handleMouseLeave() {
		if (syntaxError !== '') {
			setTipsVisible(false);
		}
	}

	return (
		<div className={styles.prettierWrapper}>
			<button
				className={styles.menuItem}
				onClick={handleClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				aria-label='prettier'
			>
				{syntaxError ? (
					<i className={styles.formatPrettierError} />
				) : (
					<i className={styles.formatPrettier} />
				)}
			</button>
			{tipsVisible ? (
				<pre className={styles.codeErrorTips}>{syntaxError}</pre>
			) : null}
		</div>
	);
}
