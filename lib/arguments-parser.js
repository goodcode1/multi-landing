 module.exports = function (arg) {
	return {
		parse: function() {
			var item, items = {};
			for(var i = 0, len = arg.length; i < len; i++) {
				if(arg[i].indexOf("=") == -1) {
					continue;
				}
				item = arg[i].split("=");
				items[item[0].replace(/-/g, "")] = item[1];
			}
			return items;
		}
	}
}