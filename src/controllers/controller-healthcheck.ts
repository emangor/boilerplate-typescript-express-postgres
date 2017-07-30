const pkg = require('./../../package.json');

export let healthcheck = (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        name: pkg.name, 
        version: pkg.version
    });  
}
