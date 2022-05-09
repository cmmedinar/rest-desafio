"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../lib/jwt");
const MISSING_AUTH_MSG = 'Missing autorization header';
function tokenValidator() {
    return function (req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: MISSING_AUTH_MSG });
            return;
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer') {
            res.status(401).json({ message: MISSING_AUTH_MSG });
            return;
        }
        try {
            const tokenPayload = (0, jwt_1.verifyToken)(token);
            req.user = tokenPayload;
        }
        catch (_a) {
            res.status(401).json({ message: MISSING_AUTH_MSG });
            return;
        }
        return next();
    };
}
exports.default = tokenValidator;
