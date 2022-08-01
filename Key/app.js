const kb = require("./src/exploit"),
	AsciiTable = require("ascii-table"),
	args = process.argv.slice(2);

var os = ['mac', "macos", 'linux', 'win'],
	browser = ['firefox', 'chrome', 'edge', 'ie', 'safari'],
	xin = ['run', 'norun'];

switch (args[0], args[1], args[2]) {
	case !args[0] in os:
		console.log("Cannot target OS"); break;
	case !args[1] in browser:
		console.log("Cannot target browser"); break;
	case !args[2] in xin:
		console.log("Not declaring XIN1A script....");
		break;
	//case !args[0] || args[0] === "-h": 	
};

try {
	if (args.length == 0 | args[0] === "-h") {
		var table = new AsciiTable('Key-Breaker');
		table.setHeading('args #', 'name', 'description')
			.addRow("win | macos | linux", "system/os", "Mandatory Argument needed to detect system!")
			.addRow("chrome | firefox", "browser", "Mandatory Argument needed to detect browser!")
			.addRow("run | norun", "xin1a", "Optional Argument needed to run xin1a");
		console.log(table.toString());
	} else {
		// store the options in a json
		let x = {
			os: args[0].toString(),
			browser: args[1].toString(),
			run: args[2].toString(),
		}, toAdd = JSON.stringify(x);
		console.log("Storing data, please wait...");

		// add it to our local database for ease of access later on
		setTimeout(() => {
			require('fs').writeFileSync("./opts.json", toAdd, e => {
				if (e) {
					var table = new AsciiTable("Error!");
					table.setHeading("Err No.", "Name", "Description")
						.addRow(e.code, e.name, e.message);
					console.log(table);
				};
			});
			try {
				require("./src/exploit");
			} catch (e) {}
			console.log("Recursive data stored! \nRunning payload....\n\nPAYLOAD PIPE:\n")
		});		
	}
	// catch any possible errors
} catch(e) {
	var table = new AsciiTable("Error!");
	table.setHeading("Err No.", "Name", "Description")
		.addRow((e.code||"Unknown"), e.name, e.message);
	console.log(table.toString());
}
// EOF