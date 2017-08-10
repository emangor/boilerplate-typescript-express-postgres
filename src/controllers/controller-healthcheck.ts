import { Request, Response } from 'express';
const pkg = require('./../../package.json');

export let healthcheck = (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        name: pkg.name, 
        version: pkg.version
    });  
}
