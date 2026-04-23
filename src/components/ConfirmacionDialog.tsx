import type { ReactNode } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import { faArrowRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CustomButton } from '@/components/Button'

export type ConfirmacionDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  subtitle?: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  loading?: boolean
  additionalInfo?: ReactNode
  zIndex?: number
}

export function ConfirmacionDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  subtitle = 'Verifica los detalles antes de continuar',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  additionalInfo,
  zIndex = 12000,
}: ConfirmacionDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            /* Sin backdrop-filter: en Chrome con varias capas (p. ej. modal + tabla) el blur
               puede aplicarse mal y dejar todo el viewport borroso u “opaco”. */
            backgroundColor: 'rgba(51, 65, 85, 0.14)',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          },
        },
      }}
      sx={{ zIndex: zIndex + 1 }}
      PaperProps={{
        sx: {
          borderRadius: '1.25rem',
          overflow: 'hidden',
          maxWidth: '26rem',
          width: '100%',
          margin: '1rem',
          isolation: 'isolate',
          filter: 'none',
          backdropFilter: 'none',
          WebkitFontSmoothing: 'antialiased',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.08) inset, 0 32px 64px -24px rgba(15, 23, 42, 0.45), 0 12px 24px -12px rgba(99, 102, 241, 0.25)',
          background: 'linear-gradient(165deg, #ffffff 0%, #f8fafc 48%, #f1f5f9 100%)',
        },
      }}
    >
      {/* Cabecera con gradiente y malla sutil */}
      <div className="relative overflow-hidden px-6 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 0%, rgba(129, 140, 248, 0.45) 0%, transparent 45%),
              radial-gradient(circle at 90% 20%, rgba(56, 189, 248, 0.35) 0%, transparent 40%),
              linear-gradient(135deg, #312e81 0%, #4338ca 35%, #2563eb 70%, #0ea5e9 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute -inset-3 rounded-full bg-white/15 blur-2xl" aria-hidden />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35)] sm:h-17 sm:w-17">
              <FontAwesomeIcon icon={faCircleCheck} className="text-[2rem] text-white drop-shadow-md sm:text-[2.15rem]" />
            </div>
            <div className="absolute -bottom-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-cyan-300/90 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
          </div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100/90">Listo para continuar</p>
          <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-sm sm:text-2xl">{title}</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-indigo-100/95">{subtitle}</p>
        </div>
      </div>

      <DialogContent sx={{ p: 0, background: 'transparent' }}>
        <div className="-mt-5 px-5 pb-2 sm:px-7">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/4 sm:p-6">
            <div className="border-l-[3px] border-indigo-500 pl-4">
              <div className="text-[15px] leading-relaxed text-slate-700 [&_p]:m-0">
                {typeof message === 'string' ? <p>{message}</p> : message}
              </div>
            </div>

            {additionalInfo ? (
              <div className="mt-5 rounded-xl border border-indigo-100/80 bg-linear-to-br from-indigo-50/80 to-sky-50/50 px-4 py-3.5 text-sm text-slate-700">
                {additionalInfo}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 px-5 pb-6 pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-7 sm:pb-7">
          <CustomButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-xl border-slate-200/90 px-5 py-2.5 text-sm font-semibold shadow-sm sm:w-auto"
          >
            {cancelText}
          </CustomButton>
          <CustomButton
            type="button"
            variant="primary"
            onClick={onConfirm}
            isLoading={loading}
            disabled={loading}
            className="w-full rounded-xl border-0 bg-linear-to-r from-indigo-600 via-blue-600 to-sky-500 px-6 py-2.5 text-sm font-semibold shadow-[0_12px_28px_-10px_rgba(37,99,235,0.65)] sm:w-auto sm:min-w-38"
          >
            <span className="inline-flex items-center gap-2">
              {confirmText}
              {!loading ? <FontAwesomeIcon icon={faArrowRight} className="text-xs opacity-90" /> : null}
            </span>
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}
