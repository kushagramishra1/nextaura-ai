import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/knowledge.functions-BI8TxcJS.js
var listKnowledgeBases = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(createSsrRpc("0b893903c510505b39db1c0249531b9a701880abf40307fb2434013340e48608"));
var getKnowledgeBase = createServerFn({ method: "GET" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("656911f9425771340135f97412214d5b73d199c0b77f565626772bd78c30afc6"));
var createKnowledgeBase = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim();
	if (name.length < 2) throw new Error("Name is required");
	return {
		orgId: input.orgId,
		name,
		description: input.description.trim()
	};
}).middleware([authMiddleware]).handler(createSsrRpc("6ccc4abe59568258d8bf6ee189a49ce414f2511cb237bc550a4fc9ccdcf73a5a"));
var deleteKnowledgeBase = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("78a1123669b915f90e53215a1ce7dada95bb48db139303734f3424bb85d099dd"));
var listDocuments = createServerFn({ method: "GET" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("47663f4c5287a128afac3cc0ae2da2b071b26315860bd1ffb707b81df756200b"));
var getDocument = createServerFn({ method: "GET" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("072bfffcc35aaea5f2a799abccbdaad2b5a5bafac74e2540f4093e19b9c3c3e4"));
var ingestDocument = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("579f147a54362dc5245a2d8715f7db1cccf7411c2b41e0b69f4db5c899c412c4"));
var deleteDocument = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("61d875481b43d3fd097c574899f2719001e80e24d1eca2c6b41dd5c2f62da552"));
//#endregion
export { getKnowledgeBase as a, listKnowledgeBases as c, getDocument as i, deleteDocument as n, ingestDocument as o, deleteKnowledgeBase as r, listDocuments as s, createKnowledgeBase as t };
