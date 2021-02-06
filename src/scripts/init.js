var preloader;
        var adCompleteFlag = false;
        var resCompleteFlag = false;

        var adEndComplete = false;
        var resEndComplete = false;

        judgeLanTitle();

        function judgeLanTitle() {
            //        console.log("window.navigator.language",window.navigator.language);

            if (window.navigator.language == "zh-CN" || window.navigator.language == "zh-cn") {
                document.title = "合成大欧派";
            } 


        }

        var loadintT = document.getElementById("loadingText");
        var loadintGif = document.getElementById("loadingImg")
        setTimeout(function() {
            loadintGif.remove();
            loadintT.style.display = ""
            updateLabView(0.1);
        }, 1 * 1000)

        window.timer = null;
        window.tempSeconds = 1;
        window.loadData = {};
        loadData.completedCount = 0;
        loadData.totalCount = 0;

        onload();

        function onload() {
            var winHeight = document.documentElement.clientHeight;
            document.getElementById("canvasDiv").style.height = winHeight + "px";
        };
        window.onload = function() {
            document.getElementById("block-Box").style.display = "none";
        }

        function updateLabView(t) {
            if (timer != null) {
                clearInterval(timer);
            }
            timer = setInterval(function() {
                tempSeconds++;
                actualTotal();
                var loadintT = document.getElementById("loadingText")
                if (!loadintT) {
                    return;
                }
                loadintT.innerHTML = 'loading......' + parseInt(tempSeconds) + '%';

                switch (tempSeconds) {
                    case 20:
                        updateLabView(0.2);
                        break;
                    case 40:
                        updateLabView(0.3);
                        break;
                    case 60:
                        updateLabView(0.4);
                        break;
                    case 96:
                        updateLabView(5);
                        break;
                    case 97:
                        updateLabView(10);
                        break;
                    case 98:
                        updateLabView(50);
                        break;
                    case 99:
                        updateLabView(100);
                        break;
                    default:
                        if (tempSeconds >= 80 && tempSeconds < 96) {
                            updateLabView(t + 0.1);
                        }
                        break;
                }
                if (tempSeconds > 100) {
                    clearInterval(timer);
                    tempSeconds = 100
                    loadintT.innerHTML = 'loading......' + parseInt(tempSeconds) + '%';
                }
            }, t * 1000);
        }

        function actualTotal() {
            var percent = parseInt(100 * loadData.completedCount / loadData.totalCount);
            if (percent > tempSeconds && loadData.totalCount > 1) {
                tempSeconds = percent;
            }
        }