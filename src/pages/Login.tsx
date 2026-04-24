import { useEffect, useId, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faEye, faEyeSlash, faSpinner, faUsers } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";
import { CustomButton } from "../components/Button";
import { useAuth } from "@/hooks/useAuthContext";
import { useLogin } from "../hooks/useAuth";
import { useAuthStore } from "../lib/auth-store";

const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "El usuario es requerido." }),
    contrasena: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

type FieldErrors = Partial<Record<"username" | "contrasena", string>>;

export function Login() {
  const usernameId = useId();
  const contrasenaId = useId();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();
  const authStoreLoading = useAuthStore((state) => state.isLoading);

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/";

  const [username, setUsername] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showContrasena, setShowContrasena] = useState(false);


  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const isSubmitting = loginMutation.isPending || authStoreLoading;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const isFormValid = useMemo(
    () => username.trim().length > 0 && contrasena.trim().length >= 8,
    [username, contrasena],
  );

  const validateFields = () => {
    const parsed = loginSchema.safeParse({ username, contrasena });
    if (parsed.success) {
      setFieldErrors({});
      return true;
    }
    const next: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "username" || key === "contrasena") {
        next[key] = issue.message;
      }
    }
    setFieldErrors(next);
    return false;
  };

  const runSubmit = async () => {
    if (!validateFields()) return;

    try {
      await loginMutation.mutateAsync({ username: username.trim(), contrasena });
      navigate(from, { replace: true });
    } catch {
      // Error feedback is handled globally via notifications in useLogin.
    }
  };

  const usernameError = fieldErrors.username;
  const contrasenaError = fieldErrors.contrasena;

  return (
    <div className="login-page login-layout grid min-h-svh w-full text-slate-800 antialiased lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="login-hero login-hero-redesign relative hidden flex-col overflow-hidden p-10 text-zinc-100 sm:p-12 lg:flex">
        <div className="login-hero-canvas pointer-events-none absolute inset-0" aria-hidden />
        <div className="login-floating-card login-floating-card--top" aria-hidden>
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-cyan-100/90">Barberia</p>
          <p className="mt-1 text-lg font-semibold text-white">Sistema pro</p>
        </div>
        <div className="login-floating-card login-floating-card--bottom" aria-hidden>
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-blue-100/90">Operativo</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">Agenda + Clientes + Caja</p>
        </div>
        <div className="login-floating-card login-floating-card--mid login-floating-card--mini" aria-hidden>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-cyan-100/85">Hoy</p>
          <p className="mt-1 text-sm font-medium text-white">18 turnos</p>
        </div>
        <div className="login-floating-card login-floating-card--left login-floating-card--mini" aria-hidden>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-blue-100/85">Equipo</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">4 barberos activos</p>
        </div>

        <div className="relative z-10 max-w-xl space-y-5">
          <span className="login-kicker inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[0.69rem] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            Barber Shop
          </span>
          <h1 className="text-balance text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.15rem] lg:text-[2.45rem]">
            Barber Shop
          </h1>
          <p className="login-hero-description max-w-md text-sm text-slate-300/90">
            Gestion visual y rapida para tu barberia.
          </p>
        </div>

        <div className="login-hero-metrics relative z-10 mt-auto max-w-xl" aria-label="Indicadores">
          <div className="login-hero-metric">
            <FontAwesomeIcon icon={faCalendarCheck} className="h-3.5 w-3.5" />
            <span>Agenda en tiempo real</span>
          </div>
          <div className="login-hero-metric">
            <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5" />
            <span>Clientes y equipo</span>
          </div>
        </div>
      </aside>

      <div className="login-panel login-panel-redesign relative flex flex-col justify-center overflow-hidden px-5 py-14 sm:px-10 sm:py-16">
        <div className="relative z-10 mx-auto w-full max-w-[430px]">
          <div className="mb-9 text-center">
            <h2 className="text-[1.08rem] font-semibold tracking-[-0.01em] text-slate-900">
              Acceso al sistema
            </h2>
            <div
              className="mx-auto mt-3 h-px w-14 rounded-full bg-linear-to-r from-transparent via-blue-400/80 to-transparent"
              aria-hidden
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Inicia sesión para abrir agenda, clientes y caja.
            </p>
          </div>

          <div className="login-card rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
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
                  htmlFor={usernameId}
                  className="block text-left text-[0.8125rem] font-semibold tracking-wide text-slate-700"
                >
                  Correo o usuario
                </label>
                <input
                  id={usernameId}
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  autoFocus
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) {
                      setFieldErrors((prev) => ({ ...prev, username: undefined }));
                    }
                  }}
                  className={`login-input w-full rounded-xl border px-3.5 py-2.5 text-[0.9375rem] text-slate-900 shadow-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 ${
                    usernameError
                      ? "border-rose-400/80 bg-rose-950/20 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.18)]"
                      : "border-slate-200 bg-slate-50/30 hover:border-slate-300"
                  }`}
                  placeholder="usuario@barberia.com o usuario"
                  aria-invalid={Boolean(usernameError)}
                  aria-describedby={usernameError ? `${usernameId}-err` : undefined}
                />
                {usernameError ? (
                  <p
                    id={`${usernameId}-err`}
                    className="text-left text-xs font-medium leading-snug text-rose-300"
                    role="alert"
                  >
                    {usernameError}
                  </p>
                ) : (
                  <p className="text-left text-xs leading-snug text-slate-500">
                    Usa el correo o usuario asignado por tu administrador.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={contrasenaId}
                  className="block text-left text-[0.8125rem] font-semibold tracking-wide text-slate-700"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id={contrasenaId}
                    name="contrasena"
                    type={showContrasena ? "text" : "password"}
                    autoComplete="current-password"
                    value={contrasena}
                    onChange={(e) => {
                      setContrasena(e.target.value);
                      if (fieldErrors.contrasena) {
                        setFieldErrors((prev) => ({ ...prev, contrasena: undefined }));
                      }
                    }}
                  className={`login-input w-full rounded-xl border px-3.5 py-2.5 pr-12 text-[0.9375rem] text-slate-900 shadow-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 ${
                      contrasenaError
                        ? "border-rose-400/80 bg-rose-950/20 focus:border-rose-400 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.18)]"
                        : "border-slate-200 bg-slate-50/30 hover:border-slate-300"
                    }`}
                    placeholder="••••••••"
                    aria-invalid={Boolean(contrasenaError)}
                    aria-describedby={
                      contrasenaError ? `${contrasenaId}-err` : undefined
                    }
                  />
                  <CustomButton
                    type="button"
                    onClick={() => setShowContrasena((v) => !v)}
                    variant="ghost"
                    iconOnly
                    className="absolute inset-y-0 right-0 my-auto mr-1 h-9 w-9 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-700 active:scale-[0.98]"
                    aria-pressed={showContrasena}
                    aria-label={
                      showContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showContrasena ? (
                      <FontAwesomeIcon icon={faEyeSlash} className="h-5 w-5" />
                    ) : (
                      <FontAwesomeIcon icon={faEye} className="h-5 w-5" />
                    )}
                  </CustomButton>
                </div>
                {contrasenaError ? (
                  <p
                    id={`${contrasenaId}-err`}
                    className="text-left text-xs font-medium leading-snug text-rose-300"
                    role="alert"
                  >
                    {contrasenaError}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3">
                
                <CustomButton
                  type="button"
                  variant="link"
                  size="sm"
                  className="p-0 text-right"
                  onClick={() => navigate('/forgot-password', { state: { allowPublicFlow: true } })}
                >
                  ¿Olvidaste tu contraseña?
                </CustomButton>
              </div>

              <CustomButton
                type="submit"
                disabled={isSubmitting || !isFormValid}
                variant="primary"
                size="lg"
                className="login-submit-button flex w-full items-center justify-center gap-2 rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
                    Ingresando al sistema...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </CustomButton>

              <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <span className="text-left text-[0.8125rem] text-slate-500">
                  Barber v1.0
                </span>
                <CustomButton
                  type="button"
                  variant="link"
                  size="sm"
                  className="p-0 text-right"
                  onClick={() => navigate('/register', { state: { allowPublicFlow: true } })}
                >
                  Registrarse
                </CustomButton>
              </div>
            </form>
          </div>

          <p className="mt-9 text-center text-[0.8125rem] leading-relaxed text-slate-500">
            ¿No tienes acceso?{" "}
            <CustomButton
              type="button"
              variant="link"
              size="sm"
              className="p-0 font-semibold underline decoration-blue-300"
              onClick={() => navigate('/contacto', { state: { allowPublicFlow: true } })}
            >
              contáctanos
            </CustomButton>
          </p>
        </div>
      </div>
    </div>
  );
}
