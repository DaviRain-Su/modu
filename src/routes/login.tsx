import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureMyProfile } from "@/lib/server/profile";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user) {
      void navigate({ to: "/account" });
    }
  }, [user, isPending, navigate]);

  async function afterAuth() {
    try {
      await ensureMyProfile();
    } catch {
      /* profile will be created later */
    }
    void navigate({ to: "/account" });
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: name.trim() || email.split("@")[0] || "读者",
        });
        if (res.error) throw new Error(res.error.message || "注册失败");
        toast.success("注册成功");
      } else {
        const res = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (res.error) throw new Error(res.error.message || "登录失败");
        toast.success("登录成功");
      }
      await afterAuth();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败");
    } finally {
      setBusy(false);
    }
  }

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
          同步书架进度、公开批注、配置 AI 与订阅
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {mode === "signin" ? "欢迎回来" : "创建账户"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {authEnabled ? (
            <>
              <div className="grid gap-2">
                {GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      void signIn(p.providerId, { callbackURL: "/account" })
                    }
                  >
                    使用 {p.label} 继续
                  </Button>
                ))}
              </div>

              <div className="relative py-1 text-center text-xs text-fg-subtle">
                <span className="relative z-10 bg-bg-elevated px-2">
                  或使用邮箱
                </span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
              </div>

              <form className="space-y-3" onSubmit={(e) => void onEmailSubmit(e)}>
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
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : mode === "signin" ? (
                    "登录"
                  ) : (
                    "注册"
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
            </>
          ) : (
            <p className="text-sm text-fg-muted">当前环境已关闭登录。</p>
          )}

          <p className="text-center text-xs text-fg-subtle">
            <Link to="/" className="hover:text-fg">
              返回首页
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
