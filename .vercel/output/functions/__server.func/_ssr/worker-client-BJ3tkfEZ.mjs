//#region node_modules/.nitro/vite/services/ssr/assets/worker-client-BJ3tkfEZ.js
/**
* 主应用 → Cloudflare Worker 服务端客户端。
* 配置 MODU_CF_API_URL + MODU_CF_API_SECRET 后启用。
*/
function baseUrl() {
	const u = process.env.MODU_CF_API_URL?.trim() || process.env.VITE_CF_API_URL?.trim();
	return u ? u.replace(/\/$/, "") : null;
}
function secret() {
	return process.env.MODU_CF_API_SECRET?.trim() || "";
}
function storageUrl(key) {
	return `${baseUrl()}/storage/${key.split("/").filter(Boolean).map(encodeURIComponent).join("/")}`;
}
function cloudflareWorkerConfigured() {
	return Boolean(baseUrl() && secret());
}
async function cfWorkerHealth() {
	const base = baseUrl();
	if (!base) return {
		ok: false,
		detail: null
	};
	try {
		const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(5e3) });
		const text = await res.text();
		return {
			ok: res.ok,
			detail: text.slice(0, 800)
		};
	} catch (e) {
		return {
			ok: false,
			detail: String(e)
		};
	}
}
async function cfWorkerAiChat(input) {
	const base = baseUrl();
	if (!base) throw new Error("MODU_CF_API_URL 未配置");
	const res = await fetch(`${base}/ai/chat`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"x-modu-secret": secret()
		},
		body: JSON.stringify(input)
	});
	if (!res.ok) {
		const t = await res.text().catch(() => "");
		throw new Error(`CF AI ${res.status}: ${t.slice(0, 200)}`);
	}
	const json = await res.json();
	if (!json.text) throw new Error("CF AI 返回为空");
	return {
		text: json.text,
		model: json.model
	};
}
async function cfWorkerPutObject(input) {
	if (!baseUrl()) throw new Error("MODU_CF_API_URL 未配置");
	let body;
	if (typeof input.data === "string") body = input.data;
	else if (input.data instanceof ArrayBuffer) body = input.data;
	else body = input.data.buffer.slice(input.data.byteOffset, input.data.byteOffset + input.data.byteLength);
	const res = await fetch(storageUrl(input.key), {
		method: "PUT",
		headers: {
			"content-type": input.contentType || "application/octet-stream",
			"x-modu-secret": secret()
		},
		body
	});
	if (!res.ok) throw new Error(`CF R2 put ${res.status}`);
	return await res.json();
}
async function cfWorkerEnsureProfile(input) {
	const base = baseUrl();
	if (!base || !secret()) return;
	try {
		await fetch(`${base}/v1/profile/ensure`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-modu-secret": secret()
			},
			body: JSON.stringify(input)
		});
	} catch (e) {
		console.warn("[cf] ensure profile failed", e);
	}
}
//#endregion
export { cloudflareWorkerConfigured as a, cfWorkerPutObject as i, cfWorkerEnsureProfile as n, cfWorkerHealth as r, cfWorkerAiChat as t };
