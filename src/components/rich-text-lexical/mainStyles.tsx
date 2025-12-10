import styled from 'styled-components';

export const ToolBarHolder = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 1px;
	background: #fff;
	padding: 4px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	vertical-align: middle;
	overflow: auto;
	/* height: 36px; */
	position: sticky;
	top: 0;
	z-index: 2;
	overflow-y: hidden;
	/* disable vertical scroll*/

	button.toolbar-item {
		border: 0;
		display: flex;
		background: none;
		border-radius: 10px;
		padding: 8px;
		cursor: pointer;
		vertical-align: middle;
		flex-shrink: 0;
		align-items: center;
		justify-content: space-between;
	}

	button.toolbar-item:disabled {
		cursor: not-allowed;
	}

	button.toolbar-item.spaced {
		margin-right: 2px;
	}

	button.toolbar-item i.format {
		background-size: contain;
		display: inline-block;
		height: 18px;
		width: 18px;
		vertical-align: -0.25em;
		display: flex;
		opacity: 0.6;
	}

	button.toolbar-item:disabled .icon,
	button.toolbar-item:disabled .text,
	button.toolbar-item:disabled i.format,
	button.toolbar-item:disabled .chevron-down {
		opacity: 0.2;
	}

	button.toolbar-item.active {
		background-color: rgba(223, 232, 250, 0.3);
	}

	button.toolbar-item.active i {
		opacity: 1;
	}

	.toolbar-item:hover:not([disabled]) {
		background-color: #eee;
	}

	.toolbar-item.font-family .text {
		display: block;
		max-width: 40px;
	}

	.code-language {
		width: 150px;
	}

	.toolbar-item .text {
		display: flex;
		line-height: 20px;
		vertical-align: middle;
		font-size: 14px;
		color: #777;
		text-overflow: ellipsis;
		overflow: hidden;
		height: 20px;
		text-align: left;
		padding-right: 10px;
	}

	.toolbar-item .icon {
		display: flex;
		width: 20px;
		height: 20px;
		user-select: none;
		margin-right: 8px;
		line-height: 16px;
		background-size: contain;
	}

	i.chevron-down,
	.toolbar-item i.chevron-down {
		margin-top: 3px;
		width: 16px;
		height: 16px;
		display: flex;
		user-select: none;
	}

	i.chevron-down.inside {
		width: 16px;
		height: 16px;
		display: flex;
		margin-left: -25px;
		margin-top: 11px;
		margin-right: 10px;
		pointer-events: none;
	}

	.divider {
		width: 1px;
		background-color: #eee;
		margin: 0 4px;
	}

	i.palette {
		background-image: url(/images/rich-text-lexical/icons/palette.svg);
	}

	i.bucket {
		background-image: url(/images/rich-text-lexical/icons/paint-bucket.svg);
	}

	i.bold {
		background-image: url(/images/rich-text-lexical/icons/type-bold.svg);
	}

	i.italic {
		background-image: url(/images/rich-text-lexical/icons/type-italic.svg);
	}

	i.undo {
		background-image: url(/images/rich-text-lexical/icons/arrow-counterclockwise.svg);
	}

	i.redo {
		background-image: url(/images/rich-text-lexical/icons/arrow-clockwise.svg);
	}

	.icon.paragraph {
		background-image: url(/images/rich-text-lexical/icons/text-paragraph.svg);
	}

	.icon.h1 {
		background-image: url(/images/rich-text-lexical/icons/type-h1.svg);
	}

	.icon.h2 {
		background-image: url(/images/rich-text-lexical/icons/type-h2.svg);
	}

	.icon.h3 {
		background-image: url(/images/rich-text-lexical/icons/type-h3.svg);
	}

	.icon.h4 {
		background-image: url(/images/rich-text-lexical/icons/type-h4.svg);
	}

	.icon.h5 {
		background-image: url(/images/rich-text-lexical/icons/type-h5.svg);
	}

	.icon.h6 {
		background-image: url(/images/rich-text-lexical/icons/type-h6.svg);
	}

	.icon.bullet-list {
		background-image: url(/images/rich-text-lexical/icons/list-bullet.svg);
	}

	.icon.check-list {
		background-image: url(/images/rich-text-lexical/icons/list-check.svg);
	}

	.icon.numbered-list {
		background-image: url(/images/rich-text-lexical/icons/list-numbered.svg);
	}

	.icon.quote {
		background-image: url(/images/rich-text-lexical/icons/quote.svg);
	}

	.icon.code {
		background-image: url(/images/rich-text-lexical/icons/code.svg);
	}

	.icon.table {
		background-image: url(/images/rich-text-lexical/icons/table.svg);
	}

	.icon.image {
		background-image: url(/images/rich-text-lexical/icons/file-image.svg);
	}

	.icon.left-align {
		background-image: url(/images/rich-text-lexical/icons/align-left.svg);
	}

	.icon.center-align {
		background-image: url(/images/rich-text-lexical/icons/align-center.svg);
	}

	.icon.right-align {
		background-image: url(/images/rich-text-lexical/icons/align-right.svg);
	}

	.icon.justify-align {
		background-image: url(/images/rich-text-lexical/icons/align-justify.svg);
	}

	.icon.vertical-top {
		background-image: url(/images/rich-text-lexical/icons/align-top.svg);
	}

	.icon.vertical-middle {
		background-image: url(/images/rich-text-lexical/icons/align-middle.svg);
	}

	.icon.vertical-bottom {
		background-image: url(/images/rich-text-lexical/icons/align-bottom.svg);
	}

	.icon.indent {
		background-image: url(/images/rich-text-lexical/icons/indent.svg);
	}

	.icon.outdent {
		background-image: url(/images/rich-text-lexical/icons/outdent.svg);
	}

	.icon.lock {
		background-image: url(/images/rich-text-lexical/icons/lock.svg);
	}

	.icon.unlock {
		background-image: url(/images/rich-text-lexical/icons/unlock.svg);
	}

	.icon.number,
	.icon.numbered-list {
		background-image: url(/images/rich-text-lexical/icons/list-ol.svg);
	}

	.icon.bullet,
	.icon.bullet-list {
		background-image: url(/images/rich-text-lexical/icons/list-ul.svg);
	}

	.icon.check-list,
	.icon.check {
		background-image: url(/images/rich-text-lexical/icons/square-check.svg);
	}

	.icon.quote {
		background-image: url(/images/rich-text-lexical/icons/chat-square-quote.svg);
	}

	.icon.font-family {
		background-image: url(/images/rich-text-lexical/icons/font-family.svg);
	}

	i.underline {
		background-image: url(/images/rich-text-lexical/icons/type-underline.svg);
	}

	i.code {
		background-image: url(/images/rich-text-lexical/icons/code.svg);
	}

	i.link {
		background-image: url(/images/rich-text-lexical/icons/link.svg);
	}

	.icon.font-color {
		background-image: url(/images/rich-text-lexical/icons/font-color.svg);
	}

	i.chevron-down {
		background-color: transparent;
		background-size: contain;
		display: inline-block;
		height: 8px;
		width: 8px;
		background-image: url(/images/rich-text-lexical/icons/chevron-down.svg);
	}

	.icon.bg-color {
		background-image: url(/images/rich-text-lexical/icons/bg-color.svg);
	}

	.icon.dropdown-more {
		background-image: url(/images/rich-text-lexical/icons/dropdown-more.svg);
	}

	.icon.plus {
		background-image: url(/images/rich-text-lexical/icons/plus.svg);
	}

	i.poll {
		background-image: url(/images/rich-text-lexical/icons/card-checklist.svg);
	}

	.icon.columns {
		background-image: url(/images/rich-text-lexical/icons/3-columns.svg);
	}

	.icon.x {
		background-image: url(/images/rich-text-lexical/icons/x.svg);
	}

	.icon.youtube {
		background-image: url(/images/rich-text-lexical/icons/youtube.svg);
	}

	.icon.figma {
		background-image: url(/images/rich-text-lexical/icons/figma.svg);
	}

	.icon.close {
		background-image: url(/images/rich-text-lexical/icons/close.svg);
	}

	i.horizontal-rule {
		background-image: url(/images/rich-text-lexical/icons/horizontal-rule.svg);
	}

	i.page-break,
	.icon.page-break {
		background-image: url(/images/rich-text-lexical/icons/scissors.svg);
	}

	.icon.left-align,
	i.left-align {
		background-image: url(/images/rich-text-lexical/icons/text-left.svg);
	}

	.icon.center-align,
	i.center-align {
		background-image: url(/images/rich-text-lexical/icons/text-center.svg);
	}

	.icon.right-align,
	i.right-align {
		background-image: url(/images/rich-text-lexical/icons/text-right.svg);
	}

	.icon.justify-align,
	i.justify-align {
		background-image: url(/images/rich-text-lexical/icons/justify.svg);
	}

	i.outdent {
		background-image: url(/images/rich-text-lexical/icons/outdent.svg);
	}

	i.indent {
		background-image: url(/images/rich-text-lexical/icons/indent.svg);
	}

	.add-icon {
		background-image: url(/images/rich-text-lexical/icons/add-sign.svg);
		background-repeat: no-repeat;
		background-position: center;
	}

	.minus-icon {
		background-image: url(/images/rich-text-lexical/icons/minus-sign.svg);
		background-repeat: no-repeat;
		background-position: center;
	}
`;

export const DropdownUI = styled.div`
	z-index: 100;
	display: block;
	position: fixed;
	box-shadow:
		0 12px 28px #0003,
		0 2px 4px #0000001a,
		inset 0 0 0 1px #ffffff80;
	border-radius: 8px;
	min-height: 40px;
	background-color: #fff;

	.item {
		margin: 0 8px;
		padding: 8px;
		color: #050505;
		cursor: pointer;
		line-height: 16px;
		font-size: 15px;
		display: flex;
		align-content: center;
		flex-direction: row;
		flex-shrink: 0;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 8px;
		border: 0;
		max-width: 264px;
		min-width: 100px;
	}

	.item.wide {
		align-items: center;
		width: 260px;
	}

	.item.wide .icon-text-container {
		display: flex;
	}

	.item.wide .icon-text-container .text {
		min-width: 120px;
	}

	.item .shortcut {
		color: #939393;
		align-self: flex-end;
	}

	.item .active {
		display: flex;
		width: 20px;
		height: 20px;
		background-size: contain;
	}

	.item:first-child {
		margin-top: 8px;
	}

	.item:last-child {
		margin-bottom: 8px;
	}

	.item:hover {
		background-color: #eee;
	}

	.item .text {
		display: flex;
		line-height: 20px;
		flex-grow: 1;
		min-width: 150px;
	}

	.item .icon {
		display: flex;
		width: 20px;
		height: 20px;
		-webkit-user-select: none;
		user-select: none;
		margin-right: 12px;
		line-height: 16px;
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
	}

	.divider {
		width: auto;
		background-color: #eee;
		margin: 4px 8px;
		height: 1px;
	}

	.icon.paragraph {
		background-image: url(/images/rich-text-lexical/icons/text-paragraph.svg);
	}

	.icon.h1 {
		background-image: url(/images/rich-text-lexical/icons/type-h1.svg);
	}

	.icon.h2 {
		background-image: url(/images/rich-text-lexical/icons/type-h2.svg);
	}

	.icon.h3 {
		background-image: url(/images/rich-text-lexical/icons/type-h3.svg);
	}

	.icon.h4 {
		background-image: url(/images/rich-text-lexical/icons/type-h4.svg);
	}

	.icon.h5 {
		background-image: url(/images/rich-text-lexical/icons/type-h5.svg);
	}

	.icon.h6 {
		background-image: url(/images/rich-text-lexical/icons/type-h6.svg);
	}

	.icon.bullet-list {
		background-image: url(/images/rich-text-lexical/icons/list-bullet.svg);
	}

	.icon.check-list {
		background-image: url(/images/rich-text-lexical/icons/list-check.svg);
	}

	.icon.numbered-list {
		background-image: url(/images/rich-text-lexical/icons/list-ol.svg);
	}

	.icon.quote {
		background-image: url(/images/rich-text-lexical/icons/quote.svg);
	}

	.icon.code {
		background-image: url(/images/rich-text-lexical/icons/code.svg);
	}

	.icon.table {
		background-image: url(/images/rich-text-lexical/icons/table.svg);
	}

	.icon.bullet,
	.icon.bullet-list {
		background-image: url(/images/rich-text-lexical/icons/list-ul.svg);
	}

	.icon.check-list,
	.icon.check {
		background-image: url(/images/rich-text-lexical/icons/square-check.svg);
	}

	.icon.quote {
		background-image: url(/images/rich-text-lexical/icons/chat-square-quote.svg);
	}

	i.poll {
		background-image: url(/images/rich-text-lexical/icons/card-checklist.svg);
	}

	.icon.columns {
		background-image: url(/images/rich-text-lexical/icons/3-columns.svg);
	}

	.icon.x {
		background-image: url(/images/rich-text-lexical/icons/x.svg);
	}

	.icon.youtube {
		background-image: url(/images/rich-text-lexical/icons/youtube.svg);
	}

	.icon.figma {
		background-image: url(/images/rich-text-lexical/icons/figma.svg);
	}

	.icon.close {
		background-image: url(/images/rich-text-lexical/icons/close.svg);
	}

	i.horizontal-rule {
		background-image: url(/images/rich-text-lexical/icons/horizontal-rule.svg);
	}

	i.page-break,
	.icon.page-break {
		background-image: url(/images/rich-text-lexical/icons/scissors.svg);
	}

	.icon.image,
	i.image {
		background-image: url(/images/rich-text-lexical/icons/file-image.svg);
	}

	i.gif {
		background-image: url(/images/rich-text-lexical/icons/filetype-gif.svg);
	}

	i.diagram-2 {
		background-image: url(/images/rich-text-lexical/icons/diagram-2.svg);
	}

	i.equation {
		background-image: url(/images/rich-text-lexical/icons/plus-slash-minus.svg);
	}

	i.sticky {
		background-image: url(/images/rich-text-lexical/icons/sticky.svg);
	}

	.icon.caret-right {
		background-image: url(/images/rich-text-lexical/icons/caret-right-fill.svg);
	}

	i.calendar {
		background-image: url(/images/rich-text-lexical/icons/calendar.svg);
	}

	.icon.left-align,
	i.left-align {
		background-image: url(/images/rich-text-lexical/icons/text-left.svg);
	}

	.icon.center-align,
	i.center-align {
		background-image: url(/images/rich-text-lexical//icons/text-center.svg);
	}

	.icon.right-align,
	i.right-align {
		background-image: url(/images/rich-text-lexical//icons/text-right.svg);
	}

	.icon.justify-align,
	i.justify-align {
		background-image: url(/images/rich-text-lexical//icons/justify.svg);
	}

	i.outdent {
		background-image: url(/images/rich-text-lexical/icons/outdent.svg);
	}

	i.indent {
		background-image: url(/images/rich-text-lexical/icons/indent.svg);
	}

	i.lowercase {
		background-image: url(/images/rich-text-lexical/icons/type-lowercase.svg);
	}

	i.uppercase {
		background-image: url(/images/rich-text-lexical/icons/type-uppercase.svg);
	}

	i.capitalize {
		background-image: url(/images/rich-text-lexical/icons/type-capitalize.svg);
	}

	i.strikethrough {
		background-image: url(/images/rich-text-lexical/icons/type-strikethrough.svg);
	}

	i.subscript {
  	background-image: url(/images/rich-text-lexical/icons/type-subscript.svg);
	}

	i.superscript {
  	background-image: url(/images/rich-text-lexical/icons/type-superscript.svg);
	}

	i.highlight {
		background-image: url(/images/rich-text-lexical/icons/highlighter.svg);
	}

	i.clear {
  	background-image: url(/images/rich-text-lexical/icons/trash.svg);
	}
}
`;

export const EditorShell = styled.div`
	position: relative;

	span.editor-image {
		cursor: default;
		display: inline-block;
		position: relative;
		user-select: none;
	}

	.editor-image img {
		max-width: 100%;
		cursor: default;
	}

	.editor-image img.focused {
		outline: 2px solid rgb(60, 132, 244);
		user-select: none;
	}

	.editor-image img.focused.draggable {
		cursor: grab;
	}

	.editor-image img.focused.draggable:active {
		cursor: grabbing;
	}

	.editor-image .image-caption-container .tree-view-output {
		margin: 0;
		border-radius: 0;
	}

	.editor-image .image-caption-container {
		display: block;
		position: absolute;
		bottom: 4px;
		left: 0;
		right: 0;
		padding: 0;
		margin: 0;
		border-top: 1px solid #fff;
		background-color: rgba(255, 255, 255, 0.9);
		min-width: 100px;
		color: #000;
		overflow: hidden;
	}

	.editor-image .image-caption-button {
		display: block;
		position: absolute;
		bottom: 20px;
		left: 0;
		right: 0;
		width: 30%;
		padding: 10px;
		margin: 0 auto;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 5px;
		background-color: rgba(0, 0, 0, 0.5);
		min-width: 100px;
		color: #fff;
		cursor: pointer;
		user-select: none;
	}

	.editor-image .image-caption-button:hover {
		background-color: rgba(60, 132, 244, 0.5);
	}

	.editor-image .image-edit-button {
		border: 1px solid rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		background-image: url(/images/rich-text-lexical/icons/pencil-fill.svg);
		background-size: 16px;
		background-position: center;
		background-repeat: no-repeat;
		width: 35px;
		height: 35px;
		vertical-align: -0.25em;
		position: absolute;
		right: 4px;
		top: 4px;
		cursor: pointer;
		user-select: none;
	}

	.editor-image .image-edit-button:hover {
		background-color: rgba(60, 132, 244, 0.1);
	}

	.editor-image .image-resizer {
		display: block;
		width: 7px;
		height: 7px;
		position: absolute;
		background-color: rgb(60, 132, 244);
		border: 1px solid #fff;
	}

	.editor-image .image-resizer.image-resizer-n {
		top: -6px;
		left: 48%;
		cursor: n-resize;
	}

	.editor-image .image-resizer.image-resizer-ne {
		top: -6px;
		right: -6px;
		cursor: ne-resize;
	}

	.editor-image .image-resizer.image-resizer-e {
		bottom: 48%;
		right: -6px;
		cursor: e-resize;
	}

	.editor-image .image-resizer.image-resizer-se {
		bottom: -2px;
		right: -6px;
		cursor: nwse-resize;
	}

	.editor-image .image-resizer.image-resizer-s {
		bottom: -2px;
		left: 48%;
		cursor: s-resize;
	}

	.editor-image .image-resizer.image-resizer-sw {
		bottom: -2px;
		left: -6px;
		cursor: sw-resize;
	}

	.editor-image .image-resizer.image-resizer-w {
		bottom: 48%;
		left: -6px;
		cursor: w-resize;
	}

	.editor-image .image-resizer.image-resizer-nw {
		top: -6px;
		left: -6px;
		cursor: nw-resize;
	}

	span.inline-editor-image {
		cursor: default;
		display: inline-block;
		position: relative;
		z-index: 1;
	}

	.inline-editor-image img {
		max-width: 100%;
		cursor: default;
	}

	.inline-editor-image img.focused {
		outline: 2px solid rgb(60, 132, 244);
	}

	.inline-editor-image img.focused.draggable {
		cursor: grab;
	}

	.inline-editor-image img.focused.draggable:active {
		cursor: grabbing;
	}

	.inline-editor-image .image-caption-container .tree-view-output {
		margin: 0;
		border-radius: 0;
	}

	.inline-editor-image.position-full {
		margin: 1em 0 1em 0;
	}

	.inline-editor-image.position-left {
		float: left;
		width: 50%;
		margin: 1em 1em 0 0;
	}

	.inline-editor-image.position-right {
		float: right;
		width: 50%;
		margin: 1em 0 0 1em;
	}

	.inline-editor-image .image-edit-button {
		display: block;
		position: absolute;
		top: 12px;
		right: 12px;
		padding: 6px 8px;
		margin: 0 auto;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 5px;
		background-color: rgba(0, 0, 0, 0.5);
		min-width: 60px;
		color: #fff;
		cursor: pointer;
		user-select: none;
	}

	.inline-editor-image .image-edit-button:hover {
		background-color: rgba(60, 132, 244, 0.5);
	}

	.inline-editor-image .image-caption-container {
		display: block;
		background-color: #f4f4f4;
		min-width: 100%;
		color: #000;
		overflow: hidden;
	}

	.PlaygroundEditorTheme__tableScrollableWrapper {
		overflow-x: auto;
		margin: 0 25px 30px 0;
	}

	.PlaygroundEditorTheme__tableScrollableWrapper
		> .PlaygroundEditorTheme__table {
		margin-top: 0;
		margin-bottom: 0;
	}

	.PlaygroundEditorTheme__tableAlignmentCenter {
		margin-left: auto;
		margin-right: auto;
	}

	.PlaygroundEditorTheme__tableAlignmentRight {
		margin-left: auto;
	}

	.PlaygroundEditorTheme__table {
		border-collapse: collapse;
		border-spacing: 0;
		overflow-y: scroll;
		overflow-x: scroll;
		table-layout: fixed;
		width: fit-content;
		margin-top: 25px;
		margin-bottom: 30px;
	}

	.PlaygroundEditorTheme__tableScrollableWrapper.PlaygroundEditorTheme__tableFrozenRow {
		overflow-x: clip;
	}

	.PlaygroundEditorTheme__tableFrozenRow tr:nth-of-type(1) > td {
		overflow: clip;
		background-color: #fff;
		position: sticky;
		z-index: 2;
		top: 44px;
	}

	.PlaygroundEditorTheme__tableFrozenRow tr:nth-of-type(1) > th {
		overflow: clip;
		background-color: #f2f3f5;
		position: sticky;
		z-index: 2;
		top: 44px;
	}

	.PlaygroundEditorTheme__tableFrozenRow tr:nth-of-type(1) > th:after,
	.PlaygroundEditorTheme__tableFrozenRow tr:nth-of-type(1) > td:after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		border-bottom: 1px solid #bbb;
	}

	.PlaygroundEditorTheme__tableFrozenColumn tr > td:first-child {
		background-color: #fff;
		position: sticky;
		z-index: 2;
		left: 0;
	}

	.PlaygroundEditorTheme__tableFrozenColumn tr > th:first-child {
		background-color: #f2f3f5;
		position: sticky;
		z-index: 2;
		left: 0;
	}

	.PlaygroundEditorTheme__tableFrozenColumn tr > :first-child:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 100%;
		border-right: 1px solid #bbb;
	}

	.PlaygroundEditorTheme__tableRowStriping tr:nth-child(2n),
	.PlaygroundEditorTheme__tableFrozenColumn
		.PlaygroundEditorTheme__table.PlaygroundEditorTheme__tableRowStriping
		tr:nth-child(2n)
		> td:first-child {
		background-color: #f2f5fb;
	}

	.PlaygroundEditorTheme__tableSelection *::selection {
		background-color: transparent;
	}

	.PlaygroundEditorTheme__tableSelected {
		outline: 2px solid rgb(60, 132, 244);
	}

	.PlaygroundEditorTheme__tableCell {
		border: 1px solid #bbb;
		width: 75px;
		vertical-align: top;
		text-align: start;
		padding: 6px 8px;
		position: relative;
		outline: none;
		overflow: auto;
	}

	.PlaygroundEditorTheme__tableCell > * {
		overflow: inherit;
	}

	.PlaygroundEditorTheme__tableCellResizer {
		position: absolute;
		right: -4px;
		height: 100%;
		width: 8px;
		cursor: ew-resize;
		z-index: 10;
		top: 0;
	}

	.PlaygroundEditorTheme__tableCellHeader {
		background-color: #f2f3f5;
		text-align: start;
	}

	.PlaygroundEditorTheme__tableCellSelected {
		caret-color: transparent;
	}

	.PlaygroundEditorTheme__tableCellSelected:after {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: highlight;
		mix-blend-mode: multiply;
		content: '';
		pointer-events: none;
	}

	.PlaygroundEditorTheme__tableAddColumns {
		position: absolute;
		background-color: #eee;
		height: 100%;
		animation: table-controls 0.2s ease;
		border: 0;
		cursor: pointer;
	}

	.PlaygroundEditorTheme__tableAddColumns:after {
		background-image: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-plus'%3e%3cpath%20d='M8%204a.5.5%200%200%201%20.5.5v3h3a.5.5%200%200%201%200%201h-3v3a.5.5%200%200%201-1%200v-3h-3a.5.5%200%200%201%200-1h3v-3A.5.5%200%200%201%208%204z'/%3e%3c/svg%3e");
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		display: block;
		content: ' ';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.4;
	}

	.PlaygroundEditorTheme__tableAddColumns:hover,
	.PlaygroundEditorTheme__tableAddRows:hover {
		background-color: #c9dbf0;
	}

	.PlaygroundEditorTheme__tableAddRows {
		position: absolute;
		width: calc(100% - 25px);
		background-color: #eee;
		animation: table-controls 0.2s ease;
		border: 0;
		cursor: pointer;
	}

	.PlaygroundEditorTheme__tableAddRows:after {
		background-image: url("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-plus'%3e%3cpath%20d='M8%204a.5.5%200%200%201%20.5.5v3h3a.5.5%200%200%201%200%201h-3v3a.5.5%200%200%201-1%200v-3h-3a.5.5%200%200%201%200-1h3v-3A.5.5%200%200%201%208%204z'/%3e%3c/svg%3e");
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		display: block;
		content: ' ';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.4;
	}

	@keyframes table-controls {
		0% {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.PlaygroundEditorTheme__tableCellResizeRuler {
		display: block;
		position: absolute;
		width: 1px;
		background-color: #3c84f4;
		height: 100%;
		top: 0;
	}

	.PlaygroundEditorTheme__tableCellActionButtonContainer {
		display: block;
		right: 5px;
		top: 6px;
		position: absolute;
		z-index: 4;
		width: 20px;
		height: 20px;
	}

	.PlaygroundEditorTheme__tableCellActionButton {
		background-color: #eee;
		display: block;
		border: 0;
		border-radius: 20px;
		width: 20px;
		height: 20px;
		color: #222;
		cursor: pointer;
	}

	.PlaygroundEditorTheme__tableCellActionButton:hover {
		background-color: #ddd;
	}

	.table-cell-action-button-container {
		position: absolute;
		z-index: 3;
		top: 0;
		left: 0;
		will-change: transform;
	}

	.table-cell-action-button-container.table-cell-action-button-container--active {
		pointer-events: auto;
		opacity: 1;
	}

	.table-cell-action-button-container.table-cell-action-button-container--inactive {
		pointer-events: none;
		opacity: 0;
	}

	.table-cell-action-button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 0;
		position: absolute;
		top: 10px;
		right: 10px;
		border-radius: 15px;
		color: #222;
		display: inline-block;
		cursor: pointer;
	}

	i.chevron-down {
		background-color: transparent;
		background-size: contain;
		display: inline-block;
		height: 8px;
		width: 8px;
		background-image: url(/images/rich-text-lexical/icons/chevron-down.svg);
	}

	.action-button {
		background-color: #eee;
		border: 0;
		padding: 8px 12px;
		position: relative;
		margin-left: 5px;
		border-radius: 15px;
		color: #222;
		display: inline-block;
		cursor: pointer;
	}

	.action-button:hover {
		background-color: #ddd;
		color: #000;
	}

	.action-button-mic.active {
		animation: mic-pulsate-color 3s infinite;
	}

	button.action-button:disabled {
		opacity: 0.6;
		background: #eee;
		cursor: not-allowed;
	}

	.PlaygroundEditorTheme__layoutContainer {
		display: grid;
		gap: 10px;
		margin: 10px 0;
	}

	.PlaygroundEditorTheme__layoutItem {
		border: 1px dashed #ddd;
		padding: 8px 16px;
		min-width: 0;
		max-width: 100%;
	}

	.PlaygroundEditorTheme__autocomplete {
		color: #ccc;
	}

	.PlaygroundEditorTheme__textItalic {
		font-style: italic;
	}

	.PlaygroundEditorTheme__textUnderline {
		text-decoration: underline;
	}

	.PlaygroundEditorTheme__textStrikethrough {
		text-decoration: line-through;
	}

	.PlaygroundEditorTheme__textUnderlineStrikethrough {
		text-decoration: underline line-through;
	}
`;
