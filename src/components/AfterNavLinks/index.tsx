'use client'

import { Link, NavGroup } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

export const AfterNavLinks = () => {
  const pathname = usePathname()
  const href = '/admin/buy'

  const active = pathname.includes(href)

  return (
    <NavGroup label="Others">
      <Link
        className={`nav__link ${active ? 'cursor-pointer font-bold' : 'cursor-pointer  font-normal'}`}
        href={href}
      >
        {active && <div className={`nav_link-indicator`} />}
        <span className="nav__link-label">Buy</span>
      </Link>
    </NavGroup>
  )
}

export default AfterNavLinks
