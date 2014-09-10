var __extends = this.__extends || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	__.prototype = b.prototype;
	d.prototype = new __();
};

var escapeTeamcityString = function (message) {
	if (!message) {
		return "";
	}

	return message.replace(/\|/g, "||")
		.replace(/\'/g, "|\'")
		.replace(/\n/g, "|n")
		.replace(/\r/g, "|r")
		.replace(/\u0085/g, "|x")
		.replace(/\u2028/g, "|l")
		.replace(/\u2029/g, "|p")
		.replace(/\[/g, "|[")
		.replace(/\]/g, "|]");
};

var Formatter = (function (_super) {
	__extends(Formatter, _super);

	function Formatter() {
		_super.apply(this, arguments);
	}

	Formatter.prototype.format = function (failures) {
		var output = [];

		var errors = failures.reduce(function (previous, current) {
			var fileName = current.getFileName();
			var failureString = current.getFailure();
			var ruleName = current.getRuleName();
			var lineAndCharacter = current.getStartPosition().getLineAndCharacter();
			var line = lineAndCharacter.line() + 1;
			var character = lineAndCharacter.character() + 1;

			if (!previous[fileName]) {
				previous[fileName] = [];
			}

			previous[fileName].push({
				name: escapeTeamcityString(fileName + ": line " + line + ", col " + character + ", " + failureString),
				message: escapeTeamcityString(ruleName + ": " + failureString),
				detailed: escapeTeamcityString(failureString)
			});

			return previous;
		}, {});

		Object.keys(errors).forEach(function (key) {
			var suite = "TSHint: " + key;

			output.push("##teamcity[testSuiteStarted name='" + suite + "']");
			errors[key].forEach(function (test) {
				output.push("##teamcity[testStarted name='" + test.name + "']");
				output.push("##teamcity[testFailed name='" + test.name + "' message='" + test.message + "' detailed='" + test.detailed + "']");
			});
			output.push("##teamcity[testSuiteFinished name='" + suite + "']");
		});

		return output.join("\n");
	};
	
	return Formatter;
})(Lint.Formatters.AbstractFormatter);

exports.Formatter = Formatter;