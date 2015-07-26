/**
 * Dummy obj to understand that it is music
 */
var Mp3File = function(file) {
	var _file = file;

	this.getUrl = function() {
		return _file;
	};
};

var RemoteDir = function(url) {
	var _location = url;

	this.getUrl = function() {
		return _location;
	};
};

var meta = {};
meta.COMPUTER_NAME = "[[;#E0EFFB;]nico-izo.ru]";
meta.USER = "[[;#008AFF;]g][[;#E0EFFB;]uest]";
meta.greetings = "        __   __                                  _______  _______ \n" +
				 "       / /  / / ____     __  __   _  __  __     / ___  / / _____/ \n" +
				 "      / /__/ / / __ \\   / / / /  // / / / /    / /  / / / /____   \n" +
				 "     / ___  / / / / /  / / /  ///  / / / /    / /  / / /____  /   \n" +
				 "    / /  / / / / / /  / / / /\\    / /_/ /    / /__/ / _____/ /    \n" +
				 "   /_/  /_/  \\__\\_/\\ /_/ /_/ \\\\\\ /_____/    /______/ /______/     \n";

meta.greet_text = "\nWelcome to Haiku OS R5 (hrev913462)\n\nType 'help' to help or double tab to view commands\n\n";

meta.help_text = "This is J4F written console.";

meta.curdir = "/home/guest";
meta.term = {};

var d = function() {
	return Object.create(null);
};

var fs = d(); // This is /
fs.usr = d();
fs.usr.bin = d();
fs.home = d();
fs.home.guest = d();
fs.home.guest.music = new RemoteDir("/js/private/music.js");
fs.home.guest.hello = "wtf";
fs.home.guest.pi = function() { return 3.14 };
fs.home['nico-izo'] = d();
fs.home['nico-izo']['about_nico-izo'] = "Nothing to say about";

var loadRemoteDirs = function(fs) {
	for(var dir in fs) {
		if(fs[dir] instanceof RemoteDir) {
			$("head").append("<script src='%url%'></script>".replace('%url%', fs[dir].getUrl()));
		} else if(typeof fs[dir] === "object") {
			console.log(fs[dir]);
			loadRemoteDirs(fs[dir]);
		}
	}
};

var nicoterm = {};

nicoterm.promt = function(callback) {
	callback(meta.USER + "@" + meta.COMPUTER_NAME + ":" + meta.curdir + "[[;#729FCF;]$] ");
};

nicoterm.update_prompt = function() {
	meta.term.set_prompt(meta.USER + "@" + meta.COMPUTER_NAME + ":" + meta.curdir + "$ ");
};

nicoterm.greetings = function(callback) {
	var greet = meta.greetings + meta.greet_text + new Date();
	return greet;
};

nicoterm.normalize_path = function(path) {
	if(path[0] !== "/")
		path = meta.curdir + "/" + path;
	var path_obj = path.split("/");
	var path_normalized_obj = [];
	var j = 0;
	for(var i = 0; i < path_obj.length; ++i) {
		if(path_obj[i] != "" && path_obj[i] != "." && path_obj[i] != "..")
			j = path_normalized_obj.push(path_obj[i]);
		else if(path_obj[i] == "..") {
			path_normalized_obj = path_normalized_obj.slice(0, --j);
		}
	}

	return path_normalized_obj;
};

var bin = fs.usr.bin;

bin.echo = function(params) {
	var parser = new CommandLineParser(params);

	parser.addHelpOption();
	parser.addVersionOption();

	//parser.addOption("nonew", ["n", "no-newline"], "Do not add the training newline [do not work]");
	//parser.addAlternativeOption(["e"], "Enable interpretation of backslash escapes.", "!backslash");
	//parser.addAlternativeOption(["E"], "Disable interpretation of backslash escapes (default).", "!backslash");
	parser.addPositionalOption("string", "String to write");

	if(parser.has("help")) {
		this.echo(parser.helpString());
		return;
	}

	if(parser.has("version")) {
		this.echo("echo (ololo coreutils) 0.0.1");
		return;
	}

	this.echo(parser.getPositional("string"));
};

bin.help = function(params) {
	var parser = new CommandLineParser(params);

	parser.addHelpOption();
	parser.addVersionOption();

	if(parser.has("help")) {
		this.echo("You need --help option to [[b;;]HELP] command? Seriously?");
		return;
	}

	if(parser.has("version")) {
		this.echo("help (ololo coreutils) 1.0.0");
		return;
	}

	this.echo("J4F written pseudoconsole. You can do something (what you can find, exactly) with files, programs and so on");
};

bin.clear = function(params) {
	var parser = new CommandLineParser(params);

	parser.addHelpOption();
	parser.addVersionOption();

	if(parser.has("help")) {
		this.echo("Nothing is in help page for this command");
		return;
	}

	if(parser.has("version")) {
		this.echo("clear (ololo coreutils) 1.0.0");
		return;
	}

	this.clear();
};

bin.cd = function(params) {
	var parser = new CommandLineParser(params);

	parser.addPositionalOption("to");

	var arg1 = parser.getPositional("to");

	if(!arg1) {
		meta.curdir = "/home/" + meta.USER;
		nicoterm.update_prompt();
		return;
	}

	var cd_arr = nicoterm.normalize_path(arg1);
	var curdir_arr = meta.curdir.split("/");
	var j = curdir_arr.length-1;


	var new_path = "/";
	var new_obj = fs;
	for(var i = 0; i < cd_arr.length; ++i) {
			if(cd_arr[i] == "")
			continue;
		switch(typeof new_obj[cd_arr[i]]) {
			case "object":
				new_obj = new_obj[cd_arr[i]];
				new_path += cd_arr[i] + "/";
				break;
			case "function":
				this.echo("cd: " + arg1 + ": This is not directory but binary file");
				return;
				break;
			case "string":
				this.echo("cd: " + arg1 + ": This is not directory but text file");
				return;
				break;
			case "undefined":
				this.echo("cd: " + arg1 + ": No such file or directory");
				return;
				break;
		}
	}

	if (new_path != "/" && new_path[new_path.length-1] == "/")
		new_path = new_path.slice(0, new_path.length-1);

	meta.curdir = new_path;
	nicoterm.update_prompt();
};

bin.ls = function(params) {
	var parser = new CommandLineParser(params);

	parser.addPositionalOption("to");

	var arg1 = parser.getPositional("to");
	if(!arg1)
		arg1 = meta.curdir;

	var ls_arr = nicoterm.normalize_path(arg1);

	var new_obj = fs;
	for(var i = 0; i < ls_arr.length; ++i) {

		switch(typeof new_obj[ls_arr[i]]) {
			case "object":
				new_obj = new_obj[ls_arr[i]];
				break;
			case "function":
				this.echo(arg1);
				return;
				break;
			case "string":
				this.echo(arg1);
				return;
				break;
			case "undefined":
				this.echo("ls: cannot access " + arg1 + ": No such file or directory");
				return;
				break;
		}
	}

	var result = "";
	for(var i = 0; i < Object.keys(new_obj).length; ++i)
		result += Object.keys(new_obj)[i] + "  ";

	this.echo(result);
};

bin.cat = function(params) {
	var parser = new CommandLineParser(params);

	parser.addPositionalOption("to");

	var arg1 = parser.getPositional("to");

	if(!arg1)
		arg1 = meta.curdir;

	var ls_arr = nicoterm.normalize_path(arg1);

	var new_obj = fs;

	for(var i = 0; i < ls_arr.length; ++i) {

		switch(typeof new_obj[ls_arr[i]]) {
			case "object":
				new_obj = new_obj[ls_arr[i]];
				break;
			case "function":
				this.echo("cat: " + arg1 + ": This is binary file");
				return;
				break;
			case "string":
				this.echo(new_obj[ls_arr[i]]);
				return;
				break;
			case "undefined":
				this.echo("cat: " + arg1 + ": No such file or directory");
				return;
				break;
		}
	}

	this.echo("cat: " + arg1 + ": This is directory");

};

/**
 * oh, let's play
 */

bin.mplayer = function(params) {
	var parser = new CommandLineParser(params);
	parser.addPositionalOption("to");
	var arg1 = parser.getPositional("to");
	if(!arg1)
		arg1 = meta.curdir;

	var ls_arr = nicoterm.normalize_path(arg1);
	var new_obj = fs;

	for(var i = 0; i < ls_arr.length; ++i) {
		switch(typeof new_obj[ls_arr[i]]) {
			case "object":
				new_obj = new_obj[ls_arr[i]];
				break;
			case "undefined":
				this.echo("mplayer: " + arg1 + ": No such file or directory");
				return;
				break;
		}
	}

	if(!(new_obj instanceof Mp3File)) {
		this.echo("mplayer: " + arg1 + ": bad format");
		return;
	}

	this.pause();

	var txt = "<audio src='%FILE%' autoplay id='uberplayer'></audio>".replace("%FILE%", new_obj.getUrl());

	var player = $(txt);

	$("body").append(player);

	var self = this; // TODO: oh, I simple do not want .call()
	var handler = function(event) {
		if(event.keyCode === 67 && event.ctrlKey === true) {
			self.resume();
			$("body").unbind("keydown", handler);
			player[0].pause();
			$("#uberplayer").remove();
			return;
		} else if(event.ctrlKey === true && event.keyCode !== 17) { // TODO
			self.echo("Are you trying to escape?");
		}
	};

	$("body").keydown(handler); // and how can I do this with terminal methods?

};

$(document).ready(function() {
	loadRemoteDirs(fs);

	meta.term = $('#izolenta').terminal(function(argv, term) {
		console.log("window.scrollTo(0, %s)", document.body.scrollHeight);
		window.scrollTo(0, document.body.scrollHeight);

		var params = argv.split(" ");
		var command = params[0];
		if(command === "") {
			return;
		}

		if($.isFunction(bin[command]))
			bin[command].call(term, argv);
		else if(command[0] === "." || command[0] === "/") {
			var dir = fs;
			var path = nicoterm.normalize_path(command);
			for(var i = 0; i < path.length; ++i) {
				if(typeof dir[path[i]] === "object")
					dir = dir[path[i]];
				else if(i + 1 === path.length && $.isFunction(dir[path[i]]))
					dir[path[i]].call(term, argv);
				else if(dir[path[i]] === undefined)
					term.echo(command + ": no such file or directory");
				else if(i + 1 === path.length && !$.isFunction(dir[path[i]]))
					term.echo(command + ": not a program");
				else
					term.echo(command + ": command not found");
			}
		} else
			term.echo(command + ": command not found");

	}, {
		prompt: nicoterm.promt,
		greeting: false,
		history: true,
		greetings: nicoterm.greetings(),
		tabcompletion: true,
		checkArity: false,
		processArguments: function(arg) {
			return arg;
		},
		historyFilter: function(command) {
			if(command[0] === " ")
				return false;
			return true;
		},
		keydown: function(event, terminal) {
			console.log(event);
			if(event.keyCode === 9) { // tab
				console.log(terminal);
				//return false;
			}
			//return true;
		},
		completion: function(terminal, str, callback) {
			var ls_arr = nicoterm.normalize_path(meta.curdir);
			var new_obj = fs;
			
			for(var i = 0; i < ls_arr.length; ++i) {
				switch(typeof new_obj[ls_arr[i]]) {
					case "object":
						new_obj = new_obj[ls_arr[i]];
						break;
					default:
						// literally, it's impossible
						console.log("wtf", ls_arr[i]);
				}
			}
			
			
			var arrayOfFiles = Object.keys(new_obj);
			callback(arrayOfFiles);
		}
	});
});
