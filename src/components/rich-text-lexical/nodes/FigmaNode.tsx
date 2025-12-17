/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import {
	DecoratorBlockNode,
	SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';
import type { JSX } from 'react';
import type {
	DOMConversionMap,
	DOMConversionOutput,
	DOMExportOutput,
	EditorConfig,
	ElementFormatType,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	Spread,
} from 'lexical';

type FigmaComponentProps = Readonly<{
	className: Readonly<{
		base: string;
		focus: string;
	}>;
	format: ElementFormatType | null;
	nodeKey: NodeKey;
	documentID: string;
}>;

function FigmaComponent({
	className,
	format,
	nodeKey,
	documentID,
}: FigmaComponentProps) {
	const figmaUrl = `https://www.figma.com/file/${documentID}`;
	const iframeSrc = `https://www.figma.com/embed?embed_host=lexical&url=${encodeURIComponent(
		figmaUrl,
	)}`;
	return (
		<BlockWithAlignableContents
			className={className}
			format={format}
			nodeKey={nodeKey}
		>
			<iframe
				width='560'
				height='315'
				src={iframeSrc}
				allowFullScreen={true}
			/>
		</BlockWithAlignableContents>
	);
}

export type SerializedFigmaNode = Spread<
	{
		documentID: string;
	},
	SerializedDecoratorBlockNode
>;

export class FigmaNode extends DecoratorBlockNode {
	__id: string;

	static getType(): string {
		return 'figma';
	}

	static clone(node: FigmaNode): FigmaNode {
		return new FigmaNode(node.__id, node.__format, node.__key);
	}

	static importJSON(serializedNode: SerializedFigmaNode): FigmaNode {
		return $createFigmaNode(serializedNode.documentID).updateFromJSON(
			serializedNode,
		);
	}

	exportJSON(): SerializedFigmaNode {
		return {
			...super.exportJSON(),
			documentID: this.__id,
		};
	}

	constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
		super(format, key);
		this.__id = id;
	}

	exportDOM(): DOMExportOutput {
		const figmaUrl = `https://www.figma.com/file/${this.__id}`;
		const iframeSrc = `https://www.figma.com/embed?embed_host=lexical&url=${encodeURIComponent(
			figmaUrl,
		)}`;
		const element = document.createElement('iframe');
		element.setAttribute('data-lexical-figma', this.__id);
		element.setAttribute('width', '560');
		element.setAttribute('height', '315');
		element.setAttribute('src', iframeSrc);
		element.setAttribute('allowfullscreen', 'true');
		return { element };
	}

	static importDOM(): DOMConversionMap | null {
		return {
			iframe: (domNode: HTMLElement) => {
				const src = domNode.getAttribute('src') || '';
				const hasFigmaAttr = domNode.hasAttribute('data-lexical-figma');
				const isFigmaEmbed =
					src.includes('figma.com/embed') || hasFigmaAttr;
				if (!isFigmaEmbed) {
					return null;
				}
				return {
					conversion: $convertFigmaElement,
					priority: 2,
				};
			},
		};
	}

	updateDOM(): false {
		return false;
	}

	getId(): string {
		return this.__id;
	}

	getTextContent(
		_includeInert?: boolean | undefined,
		_includeDirectionless?: false | undefined,
	): string {
		return `https://www.figma.com/file/${this.__id}`;
	}

	decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
		const embedBlockTheme = config.theme.embedBlock || {};
		const className = {
			base: embedBlockTheme.base || '',
			focus: embedBlockTheme.focus || '',
		};
		return (
			<FigmaComponent
				className={className}
				format={this.__format}
				nodeKey={this.getKey()}
				documentID={this.__id}
			/>
		);
	}
}

function extractFigmaDocumentIdFromEmbedSrc(src: string): string | null {
	try {
		const url = new URL(src);
		// Example: https://www.figma.com/embed?embed_host=lexical&url=https://www.figma.com/file/<ID>
		const inner = url.searchParams.get('url');
		if (!inner) return null;
		const decoded = decodeURIComponent(inner).trim();
		const innerUrl = new URL(decoded);
		const parts = innerUrl.pathname.split('/').filter(Boolean);
		// /file/<ID>/..., /design/<ID>/..., /proto/<ID>/...
		if (parts.length >= 2) {
			const kind = parts[0];
			if (kind === 'file' || kind === 'design' || kind === 'proto') {
				return parts[1] || null;
			}
		}
		return null;
	} catch {
		return null;
	}
}

function $convertFigmaElement(
	domNode: HTMLElement,
): null | DOMConversionOutput {
	const byAttr = domNode.getAttribute('data-lexical-figma');
	if (byAttr) {
		return { node: $createFigmaNode(byAttr) };
	}
	const src = domNode.getAttribute('src') || '';
	const id = extractFigmaDocumentIdFromEmbedSrc(src);
	if (id) {
		return { node: $createFigmaNode(id) };
	}
	return null;
}

export function $createFigmaNode(documentID: string): FigmaNode {
	return new FigmaNode(documentID);
}

export function $isFigmaNode(
	node: FigmaNode | LexicalNode | null | undefined,
): node is FigmaNode {
	return node instanceof FigmaNode;
}
