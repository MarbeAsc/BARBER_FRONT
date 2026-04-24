import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Tooltip } from '@mui/material'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  iconOnly?: boolean
  tooltip?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  text?: string
  icon?: ReactNode
  isLoading?: boolean
  children: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-linear-to-r from-blue-600 to-blue-500 text-white border border-blue-600 hover:brightness-110 shadow-[0_10px_24px_-14px_rgba(37,99,235,0.8)]',
  secondary: 'bg-white text-slate-700 hover:border-slate-400 border border-slate-300',
  danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent',
  link: 'bg-transparent text-blue-700 hover:text-blue-800 border border-transparent underline-offset-[3px] hover:underline',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-2',
  lg: 'text-sm px-4 py-2.5',
}

export function CustomButton({
  type = 'button',
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
  tooltip,
  leftIcon,
  rightIcon,
  text,
  icon,
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || isLoading)
  const iconOnlyClass = iconOnly ? 'p-2 inline-flex items-center justify-center' : ''
  const resolvedLeftIcon = leftIcon ?? icon
  const hasChildren = children !== undefined && children !== null
  const resolvedText = isLoading ? 'Cargando...' : text
  const content = iconOnly ? (
    hasChildren ? children : resolvedLeftIcon
  ) : (
    <span className="inline-flex items-center gap-2">
      {resolvedLeftIcon ? <span className="inline-flex h-4 w-4 items-center justify-center">{resolvedLeftIcon}</span> : null}
      <span>{hasChildren ? children : resolvedText}</span>
      {rightIcon ? <span className="inline-flex h-4 w-4 items-center justify-center">{rightIcon}</span> : null}
    </span>
  )

  const button = (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : 'false'}
      className={`cursor-pointer rounded-md font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 ${
        variantClass[variant]
      } ${iconOnly ? iconOnlyClass : sizeClass[size]} ${className}`.trim()}
    >
      {content}
    </button>
  )

  if (!tooltip) return button

  return (
    <Tooltip
      title={tooltip}
      placement="top"
      arrow
      slotProps={{
        tooltip: {
          sx: {
            fontSize: '11px',
            fontWeight: 600,
            bgcolor: '#0f172a',
          },
        },
        arrow: {
          sx: {
            color: '#0f172a',
          },
        },
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: { offset: [0, -8] },
            },
          ],
        },
      }}
    >
      <span>{button}</span>
    </Tooltip>
  )
}

export { CustomButton as Button }
