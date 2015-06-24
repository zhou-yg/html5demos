/**
 * Created by zyg on 15/6/24.
 */
//加载的图片数量
var imgMax = 0;
var imgSrc = 'example.jpg';
var back = 'back.php';

var requestCompleteNum = 0;
var currentLoadedNum = 0;
var blobCacheArr = [];

var startTime = endTime = costTime = 0;

var str = '0';

var requestImage = function(i){
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.responseType = 'arraybuffer';
    xhr.open('GET',imgSrc);
    xhr.send();
    xhr.onreadystatechange = function(){
//        postMessage(xhr.readyState);
        if(xhr.readyState === 4){
            if(xhr.status === 200) {
                var blob = xhr.response;
                blobCacheArr.push(URL.createObjectURL(blob));

                requestCompleteNum++;
                if(requestCompleteNum>=imgMax){

                    endTime = +new Date();
                    costTime = (endTime - startTime)/1000;
                    postMessage(costTime);
                }


            }
        }else{
        }
    }
};
onmessage = function(evt){
    var data = evt.data;
    if(data.type === 'num'){
        imgMax = data.max;
        startTime = +new Date();
        for(var i=0;i<imgMax;i++){
            requestImage(i);
        }
    }else if(data === 'resource'){
        postMessage(blobCacheArr);
    }
};