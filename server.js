import http from "http";
import app from "./src/app.js"
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5011; 

// pipe => ||

const routes = {
    '/': "main",
    '/oi': "oiii",
}

// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-type': 'text/plain'});
//     res.end(routes[req.url]); 
// })
     
app.listen(port, () => {
    console.log(`Servidor na porta http://localhost:${port}`)
})