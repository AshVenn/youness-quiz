import Link from 'next/link'

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/user/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Tableau de bord
      </Link>
      <Link
        href="/user/quizzes"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Sujets/Mes Quiz
      </Link>
      <Link
        href="/user/profile"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Profil
      </Link>
      <Link
        href="/user/requests"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Demander quelque chose?
      </Link>
    </nav>
  )
}