module.exports = function (fileInfo, api) {
	const j = api.jscodeshift;

	console.log('Processing file: ' + fileInfo.path);

	return j(fileInfo.source)
		.find(j.TaggedTemplateExpression)
		.forEach(path => {
			if (
				j.MemberExpression.check(path.node.tag) &&
				(path.node.tag.object.name === 'styled' ||
					path.node.tag?.callee?.name === 'styled')
			) {
				// Existing code to modify expressions
				path.node.quasi.expressions.forEach(expression => {
					if (
						expression.type === 'ArrowFunctionExpression' &&
						expression.body.type === 'ConditionalExpression'
					) {
						let testExpression = expression.body.test;
						if (
							testExpression.type === 'MemberExpression' &&
							testExpression.object.type === 'Identifier' &&
							testExpression.object.name === 'props' &&
							!testExpression.property.name.startsWith('$')
						) {
							testExpression.property.name =
								'$' + testExpression.property.name;
							console.log(
								'Updated property in test: ',
								testExpression.property.name,
							);
						}
					}
				});
			}
		})
		.toSource({ quote: 'single' });
};
