var CommandLineParser = function(string) {
	this.string = string;
	this.params = string.split(" ");
	
	this.appeared = [];
	this.positional = [];
	
	this.options = {
		/*
		"name": {
			short: [],
			long: [],
			description: "",
			group: null
		}*/
	};
	
	this.positionals = [];
	
	this.parse();
};

CommandLineParser.prototype.parse = function() {
	var flag = "none"; // prevParam, 
	for(var i = 1; i < this.params.length; ++i) {
		var str = this.params[i];
		
		// what about ', "?
		// TODO: symbol-based parsing
		
		if(str.length >= 2 && str[0] === "-" && str[1] !== "-") {
			for(var j = 1; j < str.length; ++j)
				this.appeared.push(str[j]);
			flag = "prevParam";
		} else if(str.length > 2 && str[0] === "-" && str[1] === "-") {
			this.appeared.push(str.substr(2, str.length - 2 )); // param=ololo TODO
			flag = "prevParam";
		} else if(str.length > 0) {
			this.positional.push(str);
		}
	
	}
	
	console.log(this);
};

CommandLineParser.prototype.addArgument = function(name, _short, _long, _description) {
	this.options[name] = {
		short: _short,
		long: _long,
		description: _description,
		group: null,
	}
};

/**
 * @param parameter
 * @return bool
 */
CommandLineParser.prototype.has = function(param) {
	var option = this.options[param];
	if(!option)
		throw new Error("No such parameter was registered");
	
	return (this.appeared.indexOf(option.short) !== -1) || (this.appeared.indexOf(option.long) !== -1);
	
};

/**
 */
CommandLineParser.prototype.addHelpOption = function() {
	this.addArgument("help", "h", "help", "Prints this help");
};

/**
 */
CommandLineParser.prototype.addVersionOption = function() {
	this.addArgument("version", "v", "version", "Prints version of program");
};

/**
 */
CommandLineParser.prototype.addOption = function(name, params, description) {
};

/**
 */
CommandLineParser.prototype.addAlternativeOption = function(name, params, description, group) {
	// TODO
};

/**
 */
CommandLineParser.prototype.addPositionalOption = function(name, description) {
	this.positionals.push(name);
};

/**
 */
CommandLineParser.prototype.getPositional = function(name) {
	var val = this.positional[this.positionals.indexOf(name)];
	if(this.positionals.length === 1)
		val = this.positional.join(" ");
	return !!val?val:null;
};

/**
 */
CommandLineParser.prototype.helpString = function() {
	return "NOT YET IMPLEMENTED";
};

// let's test
(function(){
	//var c = new CommandLineParser("test param1 --test=foo -nNfdK210 param2 param3");
})();
