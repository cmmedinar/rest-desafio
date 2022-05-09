"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = __importDefault(require("../controllers/TaskController"));
const taskRoutes = (0, express_1.Router)();
const controller = new TaskController_1.default();
taskRoutes.get('/', controller.getAll);
taskRoutes.get('/:id', controller.getById);
taskRoutes.post('/', controller.create);
taskRoutes.put('/:id', controller.update);
taskRoutes.delete('/:id', controller.delete);
exports.default = taskRoutes;
