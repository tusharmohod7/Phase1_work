/************************************************************
***** event listener to check the resize of the browser *****
************************************************************/

window.addEventListener('resize', function() {
  isBrowserFullScreen();
});

/***************************************************************************************
***** this is to avoid the user to not get into full screen mode or maximized mode *****
***************************************************************************************/

// to get the width of the user's system screen
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

// to get the height of the user's system screen
function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

// to make sure that the user cant go back when the full screen error message is displayed
function doNotAllowToGoBack() {
  (function (global) { 
    if(typeof (global) === "undefined") {
        throw new Error("window is undefined");
    }
    var _hash = "!";
    var noBackPlease = function () {
        global.location.href += "#";

        // making sure we have the fruit available for juice
        global.setTimeout(function () {
            global.location.href += "!";
        }, 50);
    };
    global.onhashchange = function () {
        if (global.location.hash !== _hash) {
            global.location.hash = _hash;
        }
    };
    global.onload = function () {            
        noBackPlease();

        // disables backspace on page except on input fields and textarea..
        document.body.onkeydown = function (e) {
            var elm = e.target.nodeName.toLowerCase();
            if (e.which === 8 && (elm !== 'input' && elm  !== 'textarea')) {
                e.preventDefault();
            }
            // stopping event bubbling up the DOM tree.
            e.stopPropagation();
        };          
    }
  })(window);
}

function url_redirect(url){
    var X = setTimeout(function(){
        window.location.replace(url);
        return true;
    }, 300);
    if( window.location = url ){
        clearTimeout(X);
        return true;
    } else {
        if( window.location.href = url ){
            clearTimeout(X);
            return true;
        }else{
            clearTimeout(X);
            window.location.replace(url);
            return true;
        }
    }
    return false;
}

// this is to bring back to web surfing once the full screen is removed
function makeThingGoodBackAgain(currentUrl) {
  window.location = currentUrl;
}

// check whether the browser width is reached to maximum
function isBrowserFullScreen() {
  // checking if the window is maximized or full screened
  if(window.innerWidth == 1366 || window.fullScreen) {
    window.location = "https://www.cse.iitb.ac.in/~tusharbmohod/tor/#!";
  }
}


/****************************************************************
***** this is to get the host name of the url being fetched *****
****************************************************************/

function updateCount(keyName) {
  // console.log(keyName);
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", 'http://localhost:8082/updateCount?keyName='+keyName, false);
  xhttp.send();
}

/*******************************************
***** to calculate the hash of the url *****
*******************************************/

function getHashOfUrl(urlHostName) {
  function sha256(ascii) {
    function rightRotate(value, amount) {
      return (value>>>amount) | (value<<(32 - amount));
    };
  
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j;
    var result = ''
    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};
	
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
        k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
      }
    }
  
    ascii += '\x80'
    
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' 
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j>>8) return;
      words[i>>2] |= j << ((3 - i)%4)*8;
    }
    
	  words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)

    for (j = 0; j < words[lengthProperty];) {
      var w = words.slice(j, j += 16);
      var oldHash = hash;
      hash = hash.slice(0, 8);
      
	  for (i = 0; i < 64; i++) {
        var i2 = i + j;
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e&hash[5])^((~e)&hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
              w[i - 16]
              + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3))
              + w[i - 7]
              + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10))
            )|0
          );
        var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
        
        hash = [(temp1 + temp2)|0].concat(hash);
        hash[4] = (hash[4] + temp1)|0;
      }
      
	  for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i])|0;
      }
    }
    
	  for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i]>>(j*8))&255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    
	  return result;
  };
  
  var keyName = sha256(urlHostName);
  console.log(keyName);
  updateCount(keyName);
}

/*************************************
***** get the URL of the webpage *****
*************************************/

function getUrlHostName() {
  var urlHostName = window.location.hostname;
  console.log(urlHostName);
  getHashOfUrl(urlHostName);
}

/*****************************************************
***** this is to get the load time of a web page *****
*****************************************************/

function getLoadPageTime() {
  var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
  console.log(loadTime);
}

/*******************************************************************
***** this gives a warning to the user regarding the http page *****
*******************************************************************/

function warningForTheHTTPPage() {
  var alerted = false;
  var x = location.protocol;
  if(x == "http:" && alerted == false) {
    alert("WARNING ! \n\n This site is a HTTP connection which is NOT SECURE \n\n DO NOT enter or send password, personal details, bank details, etc. on this website. It may lead to information leakage.\n\n Proceed at your risk. \n\n For safe browsing, always visit sites that have GREEN LOCK (HTTPS connection) icon in the URL");
    alerted = true;
  }
  isBrowserFullScreen();
}

/****************************************
***** check up for the url protocol *****
****************************************/

if (document.readyState !== "loading") { 
  warningForTheHTTPPage();
}

/**********************************************
***** fetch the content page of a website *****
**********************************************/

function browserInfo(){
	console.log("page on: "+window.location.pathname);
    console.log("page referrer: "+document.referrer);
    console.log("history length: "+history.length);

    console.log("browser name: "+navigator.appName);
    console.log("browser engine: "+navigator.product);
    console.log("browser version 1a: "+navigator.appVersion);
    console.log("browser version 1b: "+navigator.userAgent);
    console.log("browser language: "+navigator.language);
    console.log("browser online: "+navigator.onLine);
    console.log("browser platform: "+navigator.platform);
    console.log("is java enabled: "+navigator.javaEnabled());
    console.log("is cookie enabled: "+navigator.cookieEnabled);
    console.log("cookie: "+document.cookie);
    console.log( decodeURIComponent(document.cookie.split(";")));
    console.log("localStorage: "+localStorage);
 //    if (window.screen.fontSmoothingEnabled == true){
	// 	console.log("Font smoothing is enabled");
	// }
	// else{
	// 	console.log("Font smoothing is disabled");
	// }
    console.log("screen size width: "+screen.width);
    console.log("screen size height: "+screen.height);
    console.log("document width: "+document.width);
    console.log("document height: "+document.height);
    console.log("innerWidth: "+innerWidth);
    console.log("innerHeight: "+innerHeight);
    console.log("screen available width: "+screen.availWidth);
    console.log("screen available height: "+screen.availHeight);
    console.log("color depth: "+screen.colorDepth);
    console.log("pixel depth: "+screen.pixelDepth);

    console.log("latitude: "+position.coords.latitude);
    console.log("longitude: "+position.coords.longitude);
    console.log("accuracy: "+position.coords.accuracy);
    console.log("altitude: "+position.coords.altitude);
    console.log("altitudeAccuracy: "+position.coords.altitudeAccuracy);
    console.log("heading: "+position.coords.heading);
    console.log("co-ordinates: "+position.coords.speed);
    console.log("timestamp: "+position.timestamp);
    getUrlHostName();
}


/*********************************
***** to get the session id  *****
*********************************/

function getJSessionId(){
    var jsId = document.cookie.match(/JSESSIONID=[^;]+/);
    if(jsId != null) {
        if (jsId instanceof Array)
            jsId = jsId[0].substring(11);
        else
            jsId = jsId.substring(11);
    }
    return jsId;
}

function getSessionID(){
	var strCookies = document.cookie;
	var cookiearray = strCookies.split(';')
	for(var i=0; i<cookiearray.length; i++){
	  name = cookiearray[i].split('=')[0];
	  value = cookiearray[i].split('=')[1];
	  if(name == 'sid')
	     sid = value;
	}
	sessionValue = '<% =Session["currentDate"] %>'
    alert(showSessionValue());
}

/*************************
***** function calls *****
*************************/
browserInfo();
getUrlHostName();