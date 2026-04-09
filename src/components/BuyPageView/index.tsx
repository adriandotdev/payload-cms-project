import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, type StepNavItem } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import React from 'react'
import { BuyPageClient } from './index.client'

export const BuyPageView: React.FC<AdminViewServerProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  if (!initPageResult.req.user) redirect('/admin/login')

  const steps: StepNavItem[] = [
    {
      url: '/buy',
      label: 'Buy',
    },
  ]

  return (
    <DefaultTemplate
      visibleEntities={initPageResult.visibleEntities}
      i18n={initPageResult.req.i18n}
      payload={initPageResult.req.payload}
      locale={initPageResult.locale}
      params={params}
      permissions={initPageResult.permissions}
      user={initPageResult.req.user || undefined}
      searchParams={searchParams}
    >
      <SetStepNav nav={steps} />
      <Gutter>
        <h1>Buy Products</h1>

        <BuyPageClient />
      </Gutter>
    </DefaultTemplate>
  )
}

export default BuyPageView
