var ml = {};



var sheet = document.createElement('style');
sheet.type = 'text/css';
sheet.innerHTML = "\n#h_6u34, #h_4Mf8 {visibility: hidden;}\n";
document.addEventListener('DOMContentLoaded', function() {
	document.head.appendChild(sheet);
}, false);



ml.load = function(url, callback) {
        var xhr;
         
        if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
        else {
            var versions = ["MSXML2.XmlHttp.5.0", 
                            "MSXML2.XmlHttp.4.0",
                            "MSXML2.XmlHttp.3.0", 
                            "MSXML2.XmlHttp.2.0",
                            "Microsoft.XmlHttp"]
 
             for(var i = 0, len = versions.length; i < len; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch(e){}
             } // end for
        }
         
        xhr.onreadystatechange = ensureReadiness;
         
        function ensureReadiness() {
            if(xhr.readyState < 4) {
                return;
            }
             
            if(xhr.status !== 200) {
                return;
            }
 
            // all is well  
            if(xhr.readyState === 4) {
                callback(xhr);
            }           
        }
         
        xhr.open('GET', url, true);
        xhr.send('');
    }

ml.getTermFromUrl = function() {
	var urlParams = window.location.search;
	if(!urlParams) {
		return false;
	}
	var urlItems = urlParams.slice(1).split('&');
	for(var i = 0, len = urlItems.length; i < len; i++) {
		var urlItem = urlItems[i].split('=');
		if(urlItem[0] == "utm_term") {
			return urlItem[1];
		}
	}

}

ml.getAllTerms = function() {


	ml.load('http://goodcode.ru:7000/get/', function(data) {
		var json = JSON.parse(data.response),
			term = ml.getTermFromUrl(),
			info = json[decodeURI(term)];

			var h1 = document.getElementById("h_6u34"),
				h2 = document.getElementById("h_4Mf8");

		if(info) {
			h1.innerHTML = info[0];
			h2.innerHTML = info[1];

			h1.style.visibility = "visible";
			h2.style.visibility = "visible";
		} else {
			h1.style.visibility = "visible";
			h2.style.visibility = "visible";
		}
	});
}

ml.getAllTerms();