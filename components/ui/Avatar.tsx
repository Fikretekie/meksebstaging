import styles from './Avatar.module.css'
const gradients: Record<string,string> = {
  blue:'linear-gradient(135deg,#2563eb,#06b6d4)',
  purple:'linear-gradient(135deg,#8b5cf6,#ec4899)',
  green:'linear-gradient(135deg,#10b981,#06b6d4)',
  gold:'linear-gradient(135deg,#f59e0b,#ef4444)',
  pink:'linear-gradient(135deg,#ec4899,#8b5cf6)',
  cyan:'linear-gradient(135deg,#06b6d4,#2563eb)',
}
interface Props { initials: string; color?: string; size?: 'sm'|'md'|'lg'|'xl' }
export default function Avatar({ initials, color='blue', size='md' }: Props) {
  return (
    <div className={`${styles.av} ${styles[size]}`} style={{ background: gradients[color] || gradients.blue }}>
      {initials}
    </div>
  )
}