(function() {
  // open web debugger console
  if (typeof VConsole !== 'undefined') {
      window.vConsole = new VConsole();
  }

  var splash = document.getElementById('splash');
  splash.style.display = 'block';


  console.log("indexlTextTTTT");

  // var cocos2d = document.createElement('script');
  // cocos2d.async = true;
  // cocos2d.src = window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js';

  // var engineLoaded = function() {
  //     document.body.removeChild(cocos2d);
  //     cocos2d.removeEventListener('load', engineLoaded, false);
  //     window.boot();
  // };
  // cocos2d.addEventListener('load', engineLoaded, false);
  // document.body.appendChild(cocos2d);
})();