import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as string, t as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read._bookId-CHWEk0Qt.js
var $$splitComponentImporter = () => import("./read._bookId-CJD_qBYE.mjs");
var searchSchema = object({ chapter: string().optional() });
var Route = createFileRoute("/read/$bookId")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
