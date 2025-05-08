import http from "http";
import app from "./src/app.js"
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5011; 

// pipe => ||

app.listen(port, () => {
    console.log(`Servidor na porta http://localhost:${port}`)
})  