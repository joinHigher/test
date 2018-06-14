var http = require('http');
var url=require('url');
const request = require('superagent')

var server = http.createServer(function (req, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    response.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    response.setHeader('Content-Type', 'application/json');
    var path = url.parse(req.url).path;
    if(req.method=="OPTIONS") {
        response.statusCode = 200;
        response.end();/*让options请求快速返回*/
    }else if(path.startsWith('/api/')){
        console.log('http://www.eastasiannews.com:8888'+path)
        let baseUrl = 'http://www1.eastasiannews.com';
        if(/POST|PUT/i.test(req.method)){
            let body = '';
            req.on('data',chuck=>{
                body += chuck
            });

            req.on('end',()=>{
                let params = JSON.parse(body);
                console.log('body',body);
                request
                .post(baseUrl+path)
                .type('form')
                .send(params)
                .then(function(res) {
                    response.end(JSON.stringify(res.body));          
                }).catch(e=>{
                    console.error(e);
                });
            })
            
        }else{
            request
            .get(baseUrl+path)
            .then(function(res) {
                response.end(JSON.stringify(res.body));          
            }).catch(e=>{
                console.error(e);
            });
        }
        
    }
   
});
server.listen(3000);
console.log("Server runing at port: " + 3000 + ".");