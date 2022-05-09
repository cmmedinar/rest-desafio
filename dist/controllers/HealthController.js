"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HealthController {
    constructor() {
        this.info = (_req, res) => {
            res.json({
                name: process.env.npm_package_name,
                version: process.env.npm_package_version
            });
        };
        this.ping = (_req, res) => {
            res.send('pong');
        };
    }
}
exports.default = HealthController;
