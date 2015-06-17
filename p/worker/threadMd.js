//加载的图片数量
var imgMax = 0;
var imgSrc = 'example.jpg';
var back = 'back_md.php';

var currentLoadedNum = 0;
var base64CacheArr = [];

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
                postMessage(base64CacheArr);
            }
        }else{
        }
    }
};

onmessage = function(evt){
    var data = evt.data;
    if(data.type === 'num'){
        imgMax = data.max;
        for(var i=0;i<imgMax;i++){
            requestImage(i);
        }
    }
}

