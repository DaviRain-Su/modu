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
import { useT } from "@/lib/i18n/locale";

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

function providerLabel(providerId: string, fallback: string, labels: { google: string; x: string }) {
  if (providerId.includes("google")) return labels.google;
  if (providerId.includes("x") || providerId.includes("twitter"))
    return labels.x;
  return fallback;
}

function providerShort(providerId: string) {
  if (providerId.includes("google")) return "Google";
  if (providerId.includes("x") || providerId.includes("twitter")) return "X";
  return "社交账号";
}

function LoginPage() {
  const t = useT();
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
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "oauth" || err === "access_denied") {
      toast.error(t.login.oauthFail);
    }
  }, []);

  async function afterAuth() {
    try {
      await authClient.getSession();
    } catch {
      /* ignore */
    }
    try {
      await ensureMyProfile();
    } catch {
      /* profile created lazily */
    }
    if (typeof window !== "undefined") {
      window.location.assign("/account");
      return;
    }
    void navigate({ to: "/account" });
  }

  async function onSocial(providerId: string) {
    if (oauthBusy || busy) return;
    setOauthBusy(providerId);
    const label = providerShort(providerId);
    toast.loading(`正在前往 ${label} 登录…`, { id: "oauth" });
    try {
      await signIn(providerId, {
        callbackURL: "/account",
        errorCallbackURL: "/login?error=oauth",
      });
      // Popup path: we still have a page; token may be set
      toast.dismiss("oauth");
      if (getBearerToken()) {
        toast.success("登录成功");
        await afterAuth();
      }
      // Top-level redirect path: browser leaves this page; toast is fine to leave
    } catch (err) {
      toast.dismiss("oauth");
      const msg = err instanceof Error ? err.message : "登录失败";
      if (/pop-up|popup|弹窗|拦截/i.test(msg)) {
        toast.error(msg, { duration: 6000 });
      } else if (/cancel|取消/i.test(msg)) {
        toast.message("已取消登录");
      } else {
        toast.error(msg, { duration: 5000 });
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
        const sess = await authClient.getSession();
        if (!sess.data?.user) {
          throw new Error(
            "登录响应成功，但会话未能保存。请刷新后重试。",
          );
        }
      }
      await afterAuth();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "操作失败";
      if (/invalid origin|forbidden/i.test(msg)) {
        toast.error(
          "登录被拒绝（Invalid origin）。请确认站点地址配置正确。",
        );
      } else if (/failed to fetch|network/i.test(msg)) {
        toast.error("无法连接登录服务，请检查网络后重试");
      } else if (/user already exists|already exists/i.test(msg)) {
        toast.error("该邮箱已注册，请直接登录");
        setMode("signin");
      } else if (/invalid.*password|invalid.*email|credentials|清空|重新注册/i.test(msg)) {
        toast.error(msg.includes("重新注册") ? msg : "邮箱或密码不正确。若刚发布过站点，请重新注册。");
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
      !status.cloudflareWorker?.configured ||
      status.authBackend === "pglite");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-fg">
          <BookOpen className="h-5 w-5" />
        </div>
        <h1 className="font-serif text-2xl font-medium tracking-tight">
          {t.login.title}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          {t.login.subtitle}
        </p>
      </div>

      {showDeployWarning ? (
        <div className="mb-4 rounded-[var(--radius-lg)] border border-accent/30 bg-accent/5 px-3 py-3 text-xs leading-relaxed text-fg-muted">
          <div className="mb-1.5 flex items-center gap-1.5 font-medium text-fg">
            <AlertTriangle className="h-3.5 w-3.5 text-accent" />
            {t.login.aboutTitle}
          </div>
          <ul className="space-y-1.5">
            <li>
              ·{" "}
              {t.login.aboutEmail}
            </li>
            <li>
              · {t.login.aboutSocial}
            </li>
            <li>
              · {t.login.aboutPersist}
            </li>
          </ul>
        </div>
      ) : null}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {mode === "signin" ? t.login.welcome : t.login.create}
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
                        loading && "ring-2 ring-primary/30",
                      )}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        providerIcon(p.providerId)
                      )}
                      <span>
                        {loading
                          ? `${t.login.opening} ${providerShort(p.providerId)}…`
                          : providerLabel(p.providerId, p.label, { google: t.login.continueGoogle, x: t.login.continueX })}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative py-1 text-center text-xs text-fg-subtle">
                <span className="relative z-10 bg-bg-elevated px-2">
                  {t.login.orEmail}
                </span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
              </div>

              <form
                className="space-y-3"
                onSubmit={(e) => void onEmailSubmit(e)}
              >
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-fg-muted">{t.login.name}</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.login.namePh}
                      autoComplete="nickname"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs text-fg-muted">{t.login.email}</label>
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
                  <label className="text-xs text-fg-muted">{t.login.password}</label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.login.passwordPh}
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
                      {mode === "signin" ? t.login.signIn : t.login.signUp}
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-fg-muted">
                {mode === "signin" ? (
                  <>
                    {t.login.noAccount}{" "}
                    <button
                      type="button"
                      className="text-fg underline-offset-4 hover:underline"
                      onClick={() => setMode("signup")}
                    >
                      {t.login.signUp}
                    </button>
                  </>
                ) : (
                  <>
                    {t.login.hasAccount}{" "}
                    <button
                      type="button"
                      className="text-fg underline-offset-4 hover:underline"
                      onClick={() => setMode("signin")}
                    >
                      {t.nav.login}
                    </button>
                  </>
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-fg-muted">{t.login.disabled}</p>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-fg-subtle">
        <Link to="/" className="hover:text-fg">
          {t.login.backHome}
        </Link>
        {" · "}
        <a href="/api/health" className="hover:text-fg">
          {t.login.systemStatus}
        </a>
      </p>
    </div>
  );
}
