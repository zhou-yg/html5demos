var i=0;

function aj() {

    var xhr = new XMLHttpRequest;

    xhr.open('GET', 'ajax.php');
    xhr.send();
    xhr.onreadystatechange = function () {
        i++;
    };
}

setInterval(function(){
    aj();
    postMessage(i);
},1000);