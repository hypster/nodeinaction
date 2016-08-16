var http=require('http');
var mime=require('mime');
var path=require('path');
var fs=require('fs');
var cache={};

function send404(res){
    res.writeHead(404,{'content-type':'text/plain'});
    res.write('404 not found');
    res.end();
}

function sendFile(res,pathname,file){
    var type=mime.lookup(path.basename(pathname));
    res.writeHead(200,{'content-type':type});
    res.write(file);
    res.end();

}

function serveStatic(res,cache,path){
    if(cache[path]){
        sendFile(res,path,cache[path]);
    }else{
        fs.exists(path,function(exists){
            if(exists){
                fs.readFile(path,function(err,data){
                    if(err)
                        send404(res);
                    else{
                        cache[path]=data;
                        sendFile(res,path,data);
                    }
                })
            }else{
                send404(res);
            }
        })
    }
}

var server=http.createServer(function(req,res){
    console.log(req.url);
    var filepath=false;
    if(req.url==='/'){
        filepath='public/index.html';
    }else{
        filepath='public'+req.url;
    }
    var abspath='./'+filepath;
    serveStatic(res,cache,abspath);
})

server.listen(3000);
console.log('start listening on port 3000');