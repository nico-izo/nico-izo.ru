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

meta.help_text = "This is J4F written console. You can browse directories (NOT YET IMPLEMENTED), kill mobs and do many different things. SORRY BUT NOW YOU CAN DO NOTHING AHAHAHAHAHAHAHAHHAH";

meta.curdir = "/home/guest";
meta.term = {};

var fs = {}; // This is /
fs.usr = {};
fs.usr.bin = {};
fs.home = {};
fs.home.guest = {};
fs.home.guest.music = {};
fs.home.guest.music.test = {};
fs.home.guest.hello = "wtf";
fs.home.guest.pi = function() { return 3.14 };
fs.home['nico-izo'] = {};
fs.home['nico-izo'].about_nicoizo = "Nothing to say about";

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

$(document).ready(function() {
	meta.term = $('#izolenta').terminal({
		echo: function(arg1) {
			this.echo(arg1);
		},
		help: function() {
			this.echo(meta.help_text);
		},
		clear: function() {
			this.clear();
		},
		cd: function(arg1) {
			console.log(arg1);
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
		},
		
		ls: function(arg1) {
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
		},
		
		cat: function(arg1) {
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
		},
		
	}, {
		prompt: nicoterm.promt,
		greeting: false,
		history: true,
		greetings: nicoterm.greetings(),
		tabcompletion: true,
		checkArity: false,
		processArguments: function(arg) {return arg.split(" ");}
	});
});
