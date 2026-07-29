import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as string, N as object } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read._bookId-CS0gGXrY.js
var $$splitComponentImporter = () => import("./read._bookId-8EDCanzb.mjs");
var searchSchema = object({ chapter: string().optional() });
var Route = createFileRoute("/read/$bookId")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
