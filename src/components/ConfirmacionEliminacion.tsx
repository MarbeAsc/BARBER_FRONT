import { useState, type ReactNode } from 'react'
import { Dialog, DialogContent, TextField, Typography } from '@mui/material'
import { faTrashCan, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CustomButton } from '@/components/Button'

const ROSE_ACCENT = '#e11d48'

export type ConfirmacionEliminacionProps = {
  open: boolean
  title?: string
  message: string | ReactNode
  onCancel: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  requireTextMatch?: string
  textMatchLabel?: string
  loading?: boolean
  zIndex?: number
}

type BodyProps = Omit<ConfirmacionEliminacionProps, 'open' | 'zIndex'>

function ConfirmacionEliminacionBody({
  title = 'Confirmar eliminación',
  message,
  onCancel,
  onConfirm,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  requireTextMatch,
  textMatchLabel,
  loading = false,
}: BodyProps) {
  const [inputValue, setInputValue] = useState('')
  const trimmedRule = requireTextMatch?.trim() ?? ''
  const needsMatch = trimmedRule.length > 0
  const isMatch = !needsMatch || inputValue.trim() === trimmedRule

  const handleConfirm = () => {
    if (!isMatch || loading) return
    onConfirm()
  }

  const handleCancel = () => {
    if (loading) return
    onCancel()
  }

  return (
    <>
      <div className="relative overflow-hidden px-6 pb-7 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            /* Menos saturación que rosa neón: sigue leyendo como “peligro” sin cansar */
            background: `linear-gradient(160deg, #7f1d1d 0%, #9f1239 42%, #be185d 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.05) 8px, rgba(255,255,255,0.05) 9px)`,
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="relative flex h-15 w-15 items-center justify-center rounded-2xl border border-white/35 bg-white/12 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.28)] sm:h-16 sm:w-16">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-[1.55rem] text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)] sm:text-[1.7rem]"
              />
            </div>
          </div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">Zona crítica</p>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-rose-100/95">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-200/90" />
            Esta acción no se puede deshacer
          </p>
        </div>
      </div>

      <DialogContent sx={{ p: 0, background: 'transparent' }}>
        <div className="-mt-4 px-5 pb-1 sm:px-7">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-6">
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-3.5">
              <div className="text-[15px] font-medium leading-relaxed text-slate-900 [&_p]:m-0">
                {typeof message === 'string' ? <p>{message}</p> : message}
              </div>
            </div>

            {needsMatch ? (
              <div className="mt-5">
                <Typography
                  variant="body2"
                  component="p"
                  sx={{
                    color: '#334155',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    marginBottom: '0.65rem',
                  }}
                >
                  {textMatchLabel || `Escribe exactamente: ${trimmedRule}`}
                </Typography>
                <TextField
                  fullWidth
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (
                      (e.ctrlKey || e.metaKey) &&
                      ['v', 'V', 'c', 'C', 'x', 'X'].includes(e.key)
                    ) {
                      e.preventDefault()
                    }
                  }}
                  placeholder={trimmedRule}
                  variant="outlined"
                  size="small"
                  autoFocus
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      backgroundColor: '#ffffff',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      fontSize: '0.875rem',
                      '& fieldset': {
                        borderColor: isMatch ? '#10b981' : '#94a3b8',
                        borderWidth: isMatch ? '2px' : '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: isMatch ? '#059669' : '#64748b',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isMatch ? '#059669' : ROSE_ACCENT,
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#0f172a',
                      letterSpacing: '0.02em',
                    },
                  }}
                />
                {inputValue && !isMatch ? (
                  <Typography
                    variant="caption"
                    component="p"
                    sx={{
                      color: '#be123c',
                      fontSize: '0.75rem',
                      marginTop: '0.5rem',
                      fontWeight: 600,
                    }}
                  >
                    No coincide. Debe ser exactamente: &quot;{trimmedRule}&quot;
                  </Typography>
                ) : null}
                {isMatch && needsMatch && inputValue ? (
                  <Typography
                    variant="caption"
                    component="p"
                    sx={{
                      color: '#059669',
                      fontSize: '0.75rem',
                      marginTop: '0.5rem',
                      fontWeight: 700,
                    }}
                  >
                    Coincidencia verificada
                  </Typography>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 px-5 pb-6 pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-7 sm:pb-7">
          <CustomButton
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
            className="w-full rounded-xl border-slate-200/90 px-5 py-2.5 text-sm font-semibold shadow-sm sm:w-auto"
          >
            {cancelText}
          </CustomButton>
          <CustomButton
            type="button"
            variant="secondary"
            onClick={handleConfirm}
            disabled={!isMatch || loading}
            isLoading={loading}
            className="w-full rounded-xl border-2 px-6 py-2.5 text-sm font-bold shadow-md sm:w-auto sm:min-w-38"
            style={
              isMatch && !loading
                ? {
                    background: 'linear-gradient(180deg, #f87171 0%, #e11d48 100%)',
                    color: '#ffffff',
                    borderColor: '#9f1239',
                    boxShadow: '0 8px 22px -10px rgba(190, 24, 93, 0.38)',
                  }
                : {
                    background: '#f1f5f9',
                    color: '#64748b',
                    borderColor: '#cbd5e1',
                    boxShadow: 'none',
                  }
            }
          >
            <span className="inline-flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faTrashCan} className="text-xs opacity-95" />
              {confirmText}
            </span>
          </CustomButton>
        </div>
      </DialogContent>
    </>
  )
}

export function ConfirmacionEliminacion({
  open,
  onCancel,
  loading = false,
  zIndex = 12000,
  ...bodyProps
}: ConfirmacionEliminacionProps) {
  const handleDialogClose = () => {
    if (loading) return
    onCancel()
  }

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            /* Mantener z-index por defecto del backdrop (-1) para no tapar el Paper. */
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
            '0 0 0 1px rgba(255,255,255,0.9) inset, 0 20px 40px -18px rgba(15, 23, 42, 0.12), 0 8px 20px -12px rgba(15, 23, 42, 0.08)',
          background: '#ffffff',
        },
      }}
    >
      {open ? <ConfirmacionEliminacionBody {...bodyProps} onCancel={onCancel} loading={loading} /> : null}
    </Dialog>
  )
}
