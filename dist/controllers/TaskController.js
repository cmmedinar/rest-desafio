"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TaskRepository_1 = __importDefault(require("../models/repositories/TaskRepository"));
const taskSchemas_1 = require("../models/validators/taskSchemas");
class TaskController {
    constructor() {
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const repository = new TaskRepository_1.default(user.sub);
            try {
                const tasks = yield repository.findAll();
                res.json(tasks);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = req.user;
            const repository = new TaskRepository_1.default(user.sub);
            try {
                const tasks = yield repository.finById(parseInt(id));
                if (!tasks) {
                    res.status(404).json({ message: 'Task not fund' });
                    return;
                }
                res.json(tasks);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const task = req.body;
            try {
                yield taskSchemas_1.createTaskSchema.validateAsync(task);
            }
            catch (error) {
                res.status(400).json({ messaje: error.message });
                return;
            }
            const user = req.user;
            const repository = new TaskRepository_1.default(user.sub);
            try {
                const newTask = yield repository.create(task);
                res.json(newTask);
            }
            catch (error) {
                if (error.code === 'P2002') {
                    res.status(409).json({ message: 'Task alredy exists ' });
                    return;
                }
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const task = req.body;
            try {
                yield taskSchemas_1.updateTaskSchema.validateAsync(task);
            }
            catch (error) {
                res.status(400).json({ messaje: error.message });
                return;
            }
            const user = req.user;
            const repository = new TaskRepository_1.default(user.sub);
            try {
                yield repository.update(parseInt(id), task);
                res.sendStatus(204);
            }
            catch (error) {
                if (error.code === 'P2002') {
                    res.status(409).json({ message: 'Task alredy exists ' });
                    return;
                }
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = req.user;
            const repository = new TaskRepository_1.default(user.sub);
            try {
                yield repository.delete(parseInt(id));
                res.sendStatus(204);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
}
exports.default = TaskController;
