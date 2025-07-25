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
exports.getPineconeClient = getPineconeClient;
exports.getResultFromQuery = getResultFromQuery;
var togetherai_1 = require("@langchain/community/embeddings/togetherai");
var pinecone_1 = require("@pinecone-database/pinecone");
var pinecone;
function getPineconeClient() {
    pinecone = new pinecone_1.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    return pinecone;
}
var embeddingAI = new togetherai_1.TogetherAIEmbeddings({
    model: process.env.TOGETHER_AI_MODEL,
    apiKey: process.env.TOGETHER_AI_API_KEY,
});
function createEmbedding(text) {
    return embeddingAI.embedQuery(text);
}
function getResultFromQuery(query, chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var pinecone, index, namespace, embeddedQuery, results, thresholdvalue, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pinecone = getPineconeClient();
                    index = pinecone.index("leafravectordb");
                    namespace = index.namespace(chatId);
                    return [4 /*yield*/, createEmbedding(query)];
                case 1:
                    embeddedQuery = _a.sent();
                    return [4 /*yield*/, namespace.query({
                            vector: embeddedQuery,
                            topK: 3,
                            includeMetadata: true,
                            includeValues: true,
                        })];
                case 2:
                    results = _a.sent();
                    thresholdvalue = 0.5;
                    data = results.matches
                        .filter(function (match) { return match.score > thresholdvalue; })
                        .map(function (match) { return match.metadata.content; })
                        .join("\n\n");
                    if (!data) {
                        return [2 /*return*/, "No results found"];
                    }
                    else {
                        console.log(results);
                        console.log("data", data);
                        return [2 /*return*/, data];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// async function getAnswers(query: string) {
//   const results = await fetch("http://localhost:3000/api/chat", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       messages: [
//         {
//           content: query,
//           role: "user",
//         },
//       ],
//     }),
//   });
//   const data = await results.json();
//   console.log(data);
// }
// getAnswers("what is future ritik holds");
