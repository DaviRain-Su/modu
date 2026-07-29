import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CHxE_ZiV.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Cdbo4bpy.js
var ensureMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("b1e72ad542101f5c789eb6af686d9cae40dbfbcd7e8099043e24e1a56dd62980"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("43089abf67b0d2fc04dd8ee11c57f4f4a6f26a675e0ebab772a5634a77d97f36"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	displayName: input.displayName.trim().slice(0, 40),
	bio: input.bio.trim().slice(0, 280)
})).handler(createSsrRpc("2516a54386004386c896f1a0ac5bdf163cb6fe80f8ce05136f7c7b30edbcc98d"));
var getPublicProfile = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("0e7a8b2c9bea19bdb107f5b2b2da3c2ee12deed900d6705770e11c06c6ac9d7a"));
var listPublicAnnotationsByUser = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("85b36a8ae330be55ee95794310da400d61502ab34f6b4021345db19b8fbeffbb"));
//#endregion
export { updateMyProfile as a, listPublicAnnotationsByUser as i, getMyProfile as n, getPublicProfile as r, ensureMyProfile as t };
