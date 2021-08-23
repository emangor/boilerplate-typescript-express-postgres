import { Request, Response } from 'express';

/**
 * healthcheck for server
 * @param { Request } req
 * @param { Response } res
 * @returns { void }
 */
export const healthcheck = (req: Request, res: Response): void => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        name: process.env.npm_package_name,
        version: process.env.npm_package_version,
    });
};
