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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var bullmq_1 = require("bullmq");
var node_fetch_1 = require("node-fetch");
var dotenv = require("dotenv");
var pdf_1 = require("@langchain/community/document_loaders/web/pdf");
var textsplitters_1 = require("@langchain/textsplitters");
var togetherai_1 = require("@langchain/community/embeddings/togetherai");
var pinecone_1 = require("@langchain/pinecone");
var pinecone_2 = require("@pinecone-database/pinecone");
dotenv.config({
    path: ".env",
});
console.log("heehe");
console.log("server started hogaya diddy");
// console.log("🌲 PINECONE_API_KEY =", process.env.PINECONE_API_KEY);
// console.log("📦 PINECONE_INDEX =", process.env.PINECONE_INDEX);
// 🌲 Pinecone setup
var pinecone = new pinecone_2.Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});
var pineconeIndex = pinecone.index(process.env.PINECONE_INDEX);
// 🧠 Embeddings setup
var embeddings = new togetherai_1.TogetherAIEmbeddings({
    model: "togethercomputer/m2-bert-80M-8k-retrieval",
    apiKey: process.env.TOGETHER_AI_API_KEY,
});
// 🧾 PDF Upload Worker
var worker = new bullmq_1.Worker("upload-pdf", function (job) { return __awaiter(void 0, void 0, void 0, function () {
    var fileUrl, response, buffer, blob, loader, rawDocs, splitter, docs, vectors, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                if (job.name !== "upload-pdf")
                    return [2 /*return*/];
                fileUrl = job.data.fileUrl;
                return [4 /*yield*/, (0, node_fetch_1.default)(fileUrl)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.buffer()];
            case 2:
                buffer = _a.sent();
                blob = new Blob([buffer], { type: "application/pdf" });
                loader = new pdf_1.WebPDFLoader(blob, { splitPages: true });
                return [4 /*yield*/, loader.load()];
            case 3:
                rawDocs = _a.sent();
                splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 200,
                });
                return [4 /*yield*/, splitter.splitDocuments(rawDocs)];
            case 4:
                docs = _a.sent();
                return [4 /*yield*/, pinecone_1.PineconeStore.fromDocuments(docs, embeddings, {
                        pineconeIndex: pineconeIndex,
                    })];
            case 5:
                vectors = _a.sent();
                console.log(vectors);
                console.log("✅ PDF embedded and stored in Pinecone.");
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.error("❌ Error processing job:", err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); }, {
    connection: {
        url: process.env.REDIS_URL,
    },
});
