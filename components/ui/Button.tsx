import styles from './Button.module.css'
interface Props {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  fullWidth?: boolean
  disabled?: boolean
}
export default function Button({ children, variant='primary', size='md', type='button', onClick, fullWidth, disabled }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[styles.btn, styles[variant], styles[size], fullWidth ? styles.full : ''].join(' ')}
    >{children}</button>
  )
}