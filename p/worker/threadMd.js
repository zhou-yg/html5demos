//加载的图片数量
var imgMax = 0;
var imgSrc = 'example.jpg';
var back = 'back_md.php';

var requestCompleteNum = 0;
var currentLoadedNum = 0;
var base64CacheArr = [];

var startTime = endTime = costTime = 0;

var str = '0';

var testlen = function(){
    str = str+str;
    postMessage(str);
};

var requestImage = function(i){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',back);
    xhr.send();
    xhr.onreadystatechange = function(){
//        postMessage(xhr.readyState);
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                var imgBase64 = xhr.responseText;
                base64CacheArr.push(imgBase64);
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
        postMessage(base64CacheArr);
    }
};