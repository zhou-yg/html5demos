http = require('http');

server = http.createServer(function(req,res){
    res.setHeader('abc','abcdefg');
    res.setHeader('Transfer-Encoding','chunked');

    res.writeHead(200, {
        'Content-Type' : 'text/html'
    });

    r1 = res.write('第一次输出<br>');
    console.log('r1:',r1);

    setTimeout(function(){
        r2 = res.write('第二次输出<br>');
        console.log('r2:',r2);

        setTimeout(function(){
           r3 = res.write('第三次输出<br>');
           console.log('r3:',r3);

           res.end('===============')
        },2000);
    },3000);

});
server.listen(1339);