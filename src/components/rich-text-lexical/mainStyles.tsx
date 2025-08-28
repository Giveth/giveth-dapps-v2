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
`;
