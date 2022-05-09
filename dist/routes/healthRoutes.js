"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HealthController_1 = __importDefault(require("../controllers/HealthController"));
const healthRoutes = (0, express_1.Router)();
const controller = new HealthController_1.default();
healthRoutes.get('/info', controller.info);
healthRoutes.get('/ping', controller.ping);
exports.default = healthRoutes;
