import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon, MailIcon, XIcon } from "@/components/auth/SocialIcons";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  getBearerToken,
  signIn,
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureMyProfile } from "@/lib/server/profile";
import { getSystemStatus } from "@/lib/server/system-status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function providerIcon(providerId: string) {
  if (providerId.includes("google")) {
    return <GoogleIcon className="h-5 w-5 shrink-0" />;
  }
  if (providerId.includes("x") || providerId.includes("twitter")) {
    return <XIcon className="h-4 w-4 shrink-0" />;
  }
  return null;
}

function providerLabel(providerId: string, fallback: string) {
  if (providerId.includes("google")) return "使用 Google 继续";
  if (providerId.includes("x") || providerId.includes("twitter"))
    return "使用 X 继续";
  return `使用 ${fallback} 继续`;
}

function LoginPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<Awaited<
    ReturnType<typeof getSystemStatus>
  > | null>(null);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: "/account" });
    }
  }, [user, isPending, navigate]);

  useEffect(() => {
    void getSystemStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const err = new URLSearchParams(window.location.search).get("error");
    if (err === "oauth") {
      toast.error("社交登录未完成，请重试或改用邮箱");
    }
  }, []);

  async function afterAuth() {
    // Ensure session is warm before profile / navigation.
    try {
      await authClient.getSession();
    } catch {
      /* ignore */
    }
    try {
      await ensureMyProfile();
    } catch {
      /* profile created lazily — not a login blocker */
    }
    // Full navigation so the session store remounts cleanly with bearer/cookie.
    if (typeof window !== "undefined") {
      window.location.assign("/account");
      return;
    }
    void navigate({ to: "/account" });
  }

  async function onSocial(providerId: string) {
    if (oauthBusy || busy) return;
    setOauthBusy(providerId);
    try {
      await signIn(providerId, {
        callbackURL: "/account",
        errorCallbackURL: "/login?error=oauth",
      });
      // Deployed: redirects away. Preview popup: session + bearer ready.
      if (getBearerToken()) {
        await afterAuth();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "登录失败";
      if (/pop-up|popup|blocked/i.test(msg)) {
        toast.error("浏览器拦截了登录弹窗，请允许弹窗后重试");
      } else if (/cancel/i.test(msg)) {
        toast.message("已取消登录");
      } else {
        toast.error(msg);
      }
    } finally {
      setOauthBusy(null);
    }
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || oauthBusy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUpWithEmail({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0] || "读者",
        });
        toast.success("注册成功");
      } else {
        await signInWithEmail({
          email: email.trim(),
          password,
        });
        toast.success("登录成功");
      }
      if (!getBearerToken()) {
        // Cookie-only path (HTTPS deploy) — still OK if getSession sees cookie.
        const sess = await authClient.getSession();
        if (!sess.data?.user) {
          throw new Error(
            "登录响应成功，但会话未能保存。请改用 HTTPS 正式域名，或刷新后重试。",
          );
        }
      }
      await afterAuth();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "操作失败";
      if (/invalid origin|forbidden/i.test(msg)) {
        toast.error(
          "登录被拒绝（Invalid origin）。正式站请设置 BETTER_AUTH_URL 为当前网站地址。",
        );
      } else if (/failed to fetch|network/i.test(msg)) {
        toast.error("无法连接登录服务，请检查网络后重试");
      } else if (/user already exists|already exists/i.test(msg)) {
        toast.error("该邮箱已注册，请直接登录");
        setMode("signin");
      } else if (/invalid.*password|invalid.*email|credentials/i.test(msg)) {
        toast.error("邮箱或密码不正确。若刚换了环境，需重新注册（数据未持久化）。");
      } else if (
        status &&
        !status.persistentDatabase &&
        /invalid|credential|password|user/i.test(msg)
      ) {
        toast.error(
          `${msg}（当前无持久数据库：重启/重新发布后旧账号会消失，请重新注册）`,
        );
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  const showDeployWarning =
    status &&
    (!status.persistentDatabase ||
      !status.grokAuthCustom ||
      !status.cloudflareWorker.configured);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-fg">
          <BookOpen className="h-5 w-5" />
        </div>
        <h1 className="font-serif text-2xl font-medium tracking-tight">
          登录墨读
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Google · X · 邮箱 —— 同步书架、批注与 AI 档案
        </p>
      </div>

      {showDeployWarning ? (
        <div className="mb-4 rounded-[var(--radius-lg)] border border-border bg-bg-subtle/80 px-3 py-3 text-xs leading-relaxed text-fg-muted">
          <div className="mb-1.5 flex items-center gap-1.5 font-medium text-fg">
            <AlertTriangle className="h-3.5 w-3.5 text-accent" />
            运行环境提示
          </div>
          <ul className="space-y-1">
            {status.notes.slice(0, 3).map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
          {!status.persistentDatabase ? (
            <p className="mt-2 text-fg">
              当前账号只存在内存里：服务重启或重新发布后，请用同一邮箱重新注册。
            </p>
          ) : null}
        </div>
      ) : null}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {mode === "signin" ? "欢迎回来" : "创建账户"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {authEnabled ? (
            <>
              <div className="grid gap-2.5">
                {GROK_PROVIDERS.map((p) => {
                  const loading = oauthBusy === p.providerId;
                  return (
                    <button
                      key={p.providerId}
                      type="button"
                      disabled={Boolean(oauthBusy) || busy}
                      onClick={() => void onSocial(p.providerId)}
                      className={cn(
                        "flex h-12 w-full items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg px-4 text-sm font-medium transition-colors",
                        "hover:bg-bg-subtle disabled:opacity-50",
                      )}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        providerIcon(p.providerId)
                      )}
                      <span>{providerLabel(p.providerId, p.label)}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative py-1 text-center text-xs text-fg-subtle">
                <span className="relative z-10 bg-bg-elevated px-2">
                  或使用邮箱
                </span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
              </div>

              <form
                className="space-y-3"
                onSubmit={(e) => void onEmailSubmit(e)}
              >
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-fg-muted">昵称</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="怎么称呼你"
                      autoComplete="nickname"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs text-fg-muted">邮箱</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-fg-muted">密码</label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 8 位"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full"
                  disabled={busy || Boolean(oauthBusy)}
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <MailIcon className="h-4 w-4" />
                      {mode === "signin" ? "邮箱登录" : "邮箱注册"}
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-fg-muted">
                {mode === "signin" ? (
                  <>
                    还没有账户？{" "}
                    <button
                      type="button"
                      className="text-fg underline-offset-4 hover:underline"
                      onClick={() => setMode("signup")}
                    >
                      注册
                    </button>
                  </>
                ) : (
                  <>
                    已有账户？{" "}
                    <button
                      type="button"
                      className="text-fg underline-offset-4 hover:underline"
                      onClick={() => setMode("signin")}
                    >
                      登录
                    </button>
                  </>
                )}
              </p>

              <p className="text-center text-[11px] leading-relaxed text-fg-subtle">
                支持 Google、X 与邮箱。若提示密码错误，多半是环境重启后旧账号已清空——点注册即可。
              </p>
            </>
          ) : (
            <p className="text-sm text-fg-muted">当前已关闭登录功能。</p>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-fg-subtle">
        <Link to="/" className="hover:text-fg">
          返回首页
        </Link>
        {" · "}
        <a href="/api/health" className="hover:text-fg">
          系统状态
        </a>
      </p>
    </div>
  );
}
