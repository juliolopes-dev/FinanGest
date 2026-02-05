import { LayoutDashboard, TrendingUp, Package, Users, Settings } from 'lucide-react'

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/', active: true },
  { icon: TrendingUp, label: 'Vendas', href: '/vendas' },
  { icon: Package, label: 'Produtos', href: '/produtos' },
  { icon: Users, label: 'Vendedores', href: '/vendedores' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[200px] flex-col bg-sidebar">
      <div className="flex h-14 items-center border-b border-white/10 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">BEZERRA</span>
            <span className="text-[9px] font-medium tracking-wider text-sidebar-muted">AUTOPEÇAS</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="border-t border-white/10 p-2">
        <a
          href="/configuracoes"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-muted transition-colors hover:bg-white/5 hover:text-sidebar-foreground"
        >
          <Settings className="h-4 w-4" />
          Configurações
        </a>
      </div>
    </aside>
  )
}
