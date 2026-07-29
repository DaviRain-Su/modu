import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, updateMyProfile } from "@/lib/server/profile";
import {
  AI_PROVIDERS,
  activateSubscription,
  getMyAiSettings,
  getMySubscription,
  saveMyAiSettings,
  type AiProviderId,
} from "@/lib/server/ai-settings";
import { listMyConversations } from "@/lib/server/ai-conversations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

const PLANS = [
  {
    id: "free" as const,
    name: "免费",
    price: "¥0",
    perks: ["书城与阅读器", "公开批注", "官方 AI 每日额度", "对话云端档案"],
  },
  {
    id: "plus" as const,
    name: "Plus",
    price: "¥18/月",
    perks: ["更高官方 AI 额度", "优先模型", "个人主页徽章"],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "¥48/月",
    perks: ["更高额度", "后续增值功能优先", "适合重度阅读"],
  },
];

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [provider, setProvider] = useState<AiProviderId>("official");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [keyMasked, setKeyMasked] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [plan, setPlan] = useState<"free" | "plus" | "pro">("free");
  const [saving, setSaving] = useState(false);
  const [convoCount, setConvoCount] = useState(0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const [profile, ai, sub, convos] = await Promise.all([
          getMyProfile(),
          getMyAiSettings(),
          getMySubscription(),
          listMyConversations({ data: {} }),
        ]);
        if (cancelled) return;
        setDisplayName(profile.displayName);
        setBio(profile.bio);
        setProvider(ai.provider);
        setBaseUrl(ai.baseUrl);
        setModel(ai.model);
        setKeyMasked(ai.apiKeyMasked);
        setHasKey(ai.hasApiKey);
        setPlan(sub.plan);
        setConvoCount(convos.length);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "加载账户失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!hydrated || isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-fg-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function saveProfile() {
    setSaving(true);
    try {
      await updateMyProfile({ data: { displayName, bio } });
      toast.success("资料已保存");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function saveAi() {
    setSaving(true);
    try {
      await saveMyAiSettings({
        data: {
          provider,
          apiKey: apiKey || undefined,
          baseUrl,
          model,
        },
      });
      const ai = await getMyAiSettings();
      setKeyMasked(ai.apiKeyMasked);
      setHasKey(ai.hasApiKey);
      setApiKey("");
      toast.success("AI 设置已保存");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function pickPlan(id: "free" | "plus" | "pro") {
    setSaving(true);
    try {
      await activateSubscription({ data: id });
      setPlan(id);
      toast.success(
        id === "free"
          ? "已切换到免费档"
          : `已开通 ${id.toUpperCase()}（演示：本地记账，无真实扣款）`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "订阅失败");
    } finally {
      setSaving(false);
    }
  }

  const meta = AI_PROVIDERS.find((p) => p.id === provider);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">账户</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-fg-muted">
            <span>{user.primaryEmail ?? user.displayName}</span>
            <span>·</span>
            <span>当前订阅</span>
            <Badge variant="accent">{plan}</Badge>
            <span className="text-xs text-fg-subtle">
              · 伴读对话 {convoCount} 段
            </span>
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link to="/u/$userId" params={{ userId: user.id }}>
            我的主页
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">个人资料</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-fg-muted">显示名</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-fg-muted">简介</label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="一句话介绍你的阅读品味"
                  rows={3}
                />
              </div>
              <Button onClick={() => void saveProfile()} disabled={saving}>
                保存资料
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <CardTitle className="text-base">AI · Pi 内核</CardTitle>
              </div>
              <p className="text-sm text-fg-muted">
                阅读器内边读边问；多轮对话写入你的账户档案（Cloudflare R2 key
                布局）。模型经{" "}
                <a
                  href="https://pi.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg underline-offset-2 hover:underline"
                >
                  pi.dev
                </a>{" "}
                的 <code className="text-xs">@earendil-works/pi-ai</code>{" "}
                统一调度。
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {AI_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProvider(p.id);
                      if (!baseUrl || meta?.defaultBase === baseUrl) {
                        setBaseUrl(p.defaultBase);
                      }
                      if (!model || meta?.defaultModel === model) {
                        setModel(p.defaultModel);
                      }
                    }}
                    className={cn(
                      "rounded-[var(--radius-lg)] border p-3 text-left transition-colors",
                      provider === p.id
                        ? "border-accent bg-accent/10"
                        : "border-border bg-bg-subtle/40 hover:bg-bg-subtle",
                    )}
                  >
                    <div className="text-sm font-medium">{p.label}</div>
                    <div className="mt-1 text-xs leading-relaxed text-fg-subtle">
                      {p.hint}
                    </div>
                  </button>
                ))}
              </div>

              {provider !== "official" && (
                <div className="space-y-3 rounded-[var(--radius-lg)] border border-border bg-bg p-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-fg-muted">
                      API Key {hasKey ? `（已保存 ${keyMasked}）` : ""}
                    </label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={hasKey ? "留空则保持原密钥" : "sk-…"}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-fg-muted">Base URL</label>
                    <Input
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="https://api.example.com/v1 或 AI Gateway compat"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-fg-muted">模型</label>
                    <Input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="model-id"
                    />
                  </div>
                </div>
              )}

              <div className="rounded-[var(--radius-md)] border border-border bg-bg-subtle/50 p-3 text-xs leading-relaxed text-fg-muted">
                <strong className="text-fg">架构（参考 liber）：</strong>
                阅读器只关心「边读边问」；服务端用 Pi 选模型，对话落库并镜像到{" "}
                <code className="text-[10px]">
                  ai-chats/&#123;userId&#125;/&#123;bookId&#125;/….json
                </code>
                。官方路径部署后配置{" "}
                <code className="text-[10px]">CLOUDFLARE_ACCOUNT_ID</code> +{" "}
                <code className="text-[10px]">CLOUDFLARE_API_KEY</code>（可选{" "}
                <code className="text-[10px]">AI_GATEWAY_ID</code>
                ）即可走 Workers AI / AI Gateway。
              </div>

              <Button onClick={() => void saveAi()} disabled={saving}>
                保存 AI 设置
              </Button>
            </CardContent>
          </Card>

          <section>
            <h2 className="mb-3 font-serif text-xl font-medium">官方订阅</h2>
            <p className="mb-4 text-sm text-fg-muted">
              不使用自有 API 时，用官方额度。以下为演示开通（无真实支付）。
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "flex flex-col rounded-[var(--radius-xl)] border p-4",
                    plan === p.id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg-elevated",
                  )}
                >
                  <div className="text-sm text-fg-muted">{p.name}</div>
                  <div className="mt-1 text-2xl font-medium tracking-tight">
                    {p.price}
                  </div>
                  <ul className="mt-3 flex-1 space-y-1.5 text-xs text-fg-muted">
                    {p.perks.map((x) => (
                      <li key={x}>· {x}</li>
                    ))}
                  </ul>
                  <Button
                    className="mt-4 w-full"
                    variant={plan === p.id ? "secondary" : "default"}
                    size="sm"
                    disabled={saving || plan === p.id}
                    onClick={() => void pickPlan(p.id)}
                  >
                    {plan === p.id ? "当前方案" : "选择"}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
