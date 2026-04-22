import { useEffect, useId, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Introduce un correo corporativo válido." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type FieldErrors = Partial<Record<"email" | "password", string>>;

function deriveNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "Usuario";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return "Usuario";
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Pon en `false` cuando la API de autenticación esté lista. Mientras tanto, entrar al panel no valida credenciales. */
const PLACEHOLDER_LOGIN = true;

export function Login() {
  const emailId = useId();
  const passwordId = useId();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const [touched, setTouched] = useState<Record<"email" | "password", boolean>>(
    {
      email: false,
      password: false,
    },
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const fieldErrors = useMemo<FieldErrors>(() => {
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "email" || key === "password") {
          next[key] = issue.message;
        }
      }
      return next;
    }
    return {};
  }, [email, password]);

  const runSubmit = async () => {
    setFormError(null);

    if (PLACEHOLDER_LOGIN) {
      setIsSubmitting(true);
      try {
        const trimmed = email.trim();
        const emailOk = z.string().email().safeParse(trimmed).success;
        const emailVal = emailOk ? trimmed : "demo@taskflow.app";
        login({
          email: emailVal,
          name: deriveNameFromEmail(emailVal),
        });
        // Una sola navegación: el `useEffect` redirige al volver autenticado y dispara el loader global.
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setTouched({ email: true, password: true });
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) return;

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 850));
      login({
        email: parsed.data.email,
        name: deriveNameFromEmail(parsed.data.email),
      });
      navigate(from, { replace: true });
    } catch {
      setFormError("No fue posible iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailError = touched.email ? fieldErrors.email : undefined;
  const passwordError = touched.password ? fieldErrors.password : undefined;

  return (
    <div className="login-page grid min-h-svh w-full bg-[#f4f4f5] text-slate-800 antialiased lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#111215] p-10 text-zinc-100 sm:p-12 lg:flex lg:border-r lg:border-white/10 lg:shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(10,10,12,0.96)_0%,rgba(22,23,28,0.92)_42%,rgba(10,10,12,0.96)_100%)]"
          
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_70%_at_10%_10%,rgba(234,179,8,0.2),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_100%_100%,rgba(59,130,246,0.18),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[-11%] top-[-9%] h-[58%] w-[22%] rotate-12 rounded-full bg-[repeating-linear-gradient(180deg,rgba(239,68,68,0.9)_0_16px,rgba(255,255,255,0.92)_16px_32px,rgba(37,99,235,0.9)_32px_48px)] opacity-20 blur-[1px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-17%] left-[-8%] h-[60%] w-[20%] -rotate-15 rounded-full bg-[repeating-linear-gradient(180deg,rgba(239,68,68,0.86)_0_16px,rgba(255,255,255,0.88)_16px_32px,rgba(37,99,235,0.86)_32px_48px)] opacity-15 blur-[2px]"
          aria-hidden
        />

        <div className="relative z-10 max-w-lg space-y-5">
          <span className="inline-flex rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-amber-200">
            Barber Suite
          </span>
          <h1 className="text-balance text-[1.65rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.125rem]">
            BarberShop Manager
          </h1>
          <p className="max-w-prose text-[0.9375rem] leading-relaxed text-zinc-300">
            Controla citas, barberos y clientes en una sola plataforma.
            Diseñado para barberías que cuidan cada detalle del servicio.
          </p>
        </div>

        <ul
          className="login-feature-list relative z-10 mt-14 max-w-lg space-y-4 text-[0.9375rem] leading-snug"
          aria-label="Capacidades principales"
        >
          {[
            "Agenda diaria con disponibilidad en tiempo real",
            "Historial de clientes y servicios por barbero",
            "Gestión de caja, turnos y productividad del equipo",
          ].map((label) => (
            <li
              key={label}
              className="flex gap-3.5 text-zinc-200 transition-[opacity,transform] duration-300 ease-out hover:translate-x-0.5 hover:opacity-95"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 shadow-[0_0_0_1px_rgba(253,230,138,0.45)] transition-opacity duration-300"
                aria-hidden
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <p className="relative z-10 mt-auto max-w-md pt-14 text-[0.6875rem] leading-relaxed text-zinc-400">
          Acceso exclusivo para personal autorizado. Si olvidaste tus
          credenciales, consulta con el administrador del local.
        </p>
      </aside>

      <div className="relative flex flex-col justify-center overflow-hidden bg-[#f8f8fb] px-5 py-14 sm:px-10 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_10%,rgba(245,158,11,0.15),transparent_65%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_40%_at_15%_88%,rgba(59,130,246,0.12),transparent_62%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-[400px]">
          <div className="mb-9 text-center">
            <h2 className="text-[1.08rem] font-semibold tracking-[-0.01em] text-slate-900">
              Acceso al sistema
            </h2>
            <div
              className="mx-auto mt-3 h-px w-14 rounded-full bg-linear-to-r from-transparent via-amber-400/80 to-transparent"
              aria-hidden
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Inicia sesión para abrir agenda, clientes y caja.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_18px_48px_-34px_rgba(15,23,42,0.22)] sm:p-8">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                void runSubmit();
              }}
              noValidate
            >
              <div className="space-y-2">
                <label
                  htmlFor={emailId}
                  className="block text-left text-[0.8125rem] font-semibold tracking-wide text-slate-700"
                >
                  Correo o usuario
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  value={email}
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-[0.9375rem] text-slate-900 shadow-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-slate-400 focus:border-blue-400/70 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.16)] ${
                    emailError
                      ? "border-rose-400/80 bg-rose-950/20 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.18)]"
                      : "border-slate-200 bg-slate-50/30 hover:border-slate-300"
                  }`}
                  placeholder="usuario@barberia.com"
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? `${emailId}-err` : undefined}
                />
                {emailError ? (
                  <p
                    id={`${emailId}-err`}
                    className="text-left text-xs font-medium leading-snug text-rose-300"
                    role="alert"
                  >
                    {emailError}
                  </p>
                ) : (
                  <p className="text-left text-xs leading-snug text-slate-500">
                    Usa el correo o usuario asignado por tu administrador.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={passwordId}
                  className="block text-left text-[0.8125rem] font-semibold tracking-wide text-slate-700"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id={passwordId}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className={`w-full rounded-xl border px-3.5 py-2.5 pr-12 text-[0.9375rem] text-slate-900 shadow-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-slate-400 focus:border-blue-400/70 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.16)] ${
                      passwordError
                        ? "border-rose-400/80 bg-rose-950/20 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.18)]"
                        : "border-slate-200 bg-slate-50/30 hover:border-slate-300"
                    }`}
                    placeholder="••••••••"
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={
                      passwordError ? `${passwordId}-err` : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 my-auto mr-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-700 active:scale-[0.98]"
                    aria-pressed={showPassword}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordError ? (
                  <p
                    id={`${passwordId}-err`}
                    className="text-left text-xs font-medium leading-snug text-rose-300"
                    role="alert"
                  >
                    {passwordError}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3">
                
                <button
                  type="button"
                  className="text-right text-[0.8125rem] font-semibold text-blue-700 underline-offset-[3px] transition-colors hover:text-blue-800 hover:underline"
                  onClick={() => {
                    /* placeholder para flujo real */
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {formError ? (
                <p
                  className="rounded-xl border border-rose-200/80 bg-rose-50/70 px-3.5 py-2.5 text-left text-sm font-medium leading-snug text-rose-800/90"
                  role="alert"
                >
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] px-4 py-3 text-[0.9375rem] font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_14px_30px_-16px_rgba(217,119,6,0.58)] transition-[filter,transform,opacity] duration-200 hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Ingresando al sistema...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
              <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <span className="text-left text-[0.8125rem] text-slate-500">
                  Barber v1.0
                </span>
                <button
                  type="button"
                  className="text-right text-[0.8125rem] font-semibold text-blue-700 underline-offset-[3px] transition-colors hover:text-blue-800 hover:underline"
                  onClick={() => {
                    /* placeholder para flujo real */
                  }}
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>

          <p className="mt-9 text-center text-[0.8125rem] leading-relaxed text-slate-500">
            ¿No tienes acceso?{" "}
            <button
              type="button"
              className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-[3px] transition-colors hover:text-blue-800 hover:decoration-blue-400"
            >
              comunícate con el administrador de tu barbería
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M10.7 10.7a3 3 0 0 0 4.6 4.6" />
      <path d="M9.88 5.09A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.17 3.79" />
      <path d="M6.61 6.61A14.4 14.4 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 3.93-.83" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`${className} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
      />
    </svg>
  );
}
