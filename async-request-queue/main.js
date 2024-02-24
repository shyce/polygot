var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var AsyncQueue = /** @class */ (function () {
    function AsyncQueue(maxConcurrentTasks) {
        if (maxConcurrentTasks === void 0) { maxConcurrentTasks = 3; }
        this.queue = [];
        this.concurrentTasks = 0;
        this.maxConcurrentTasks = 3;
        this.maxConcurrentTasks = maxConcurrentTasks;
    }
    AsyncQueue.prototype.add = function (promiseFactory) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.concurrentTasks < this.maxConcurrentTasks)) return [3 /*break*/, 4];
                        this.concurrentTasks++;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, promiseFactory()];
                    case 2:
                        result = _a.sent();
                        this.concurrentTasks--;
                        this.processQueue();
                        return [2 /*return*/, result];
                    case 3:
                        err_1 = _a.sent();
                        this.concurrentTasks--;
                        this.processQueue();
                        throw err_1;
                    case 4: 
                    // If the maximum number of concurrent tasks is reached,
                    // add the task to the queue and wait for it to be executed later
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.queue.push(function () { return __awaiter(_this, void 0, void 0, function () {
                                var result, err_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, promiseFactory()];
                                        case 1:
                                            result = _a.sent();
                                            resolve(result);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_2 = _a.sent();
                                            reject(err_2);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                }
            });
        });
    };
    AsyncQueue.prototype.processQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promiseFactory, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.queue.length > 0 && this.concurrentTasks < this.maxConcurrentTasks)) return [3 /*break*/, 4];
                        this.concurrentTasks++;
                        promiseFactory = this.queue.shift();
                        if (!promiseFactory) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, promiseFactory()];
                    case 2:
                        _b.sent();
                        this.concurrentTasks--;
                        this.processQueue();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        this.concurrentTasks--;
                        this.processQueue();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AsyncQueue;
}());
var asyncQueue = new AsyncQueue();
function exampleTask(taskNumber) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Task ".concat(taskNumber, " started"));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 1:
                    _a.sent();
                    console.log("Task ".concat(taskNumber, " completed"));
                    return [2 /*return*/, taskNumber];
            }
        });
    });
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var _loop_1, i;
    return __generator(this, function (_a) {
        _loop_1 = function (i) {
            asyncQueue.add(function () { return exampleTask(i); }).then(function (taskNumber) {
                console.log("Received result for task ".concat(taskNumber));
            });
        };
        for (i = 1; i <= 10; i++) {
            _loop_1(i);
        }
        return [2 /*return*/];
    });
}); })();
