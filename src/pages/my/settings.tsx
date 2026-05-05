import { sdk } from '@farcaster/miniapp-sdk'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { DevSection } from '@app/components/pages/profile/settings/DevSection'
import { PrimarySection } from '@app/components/pages/profile/settings/PrimarySection/PrimarySection'
import { PrivacySection } from '@app/components/pages/profile/settings/PrivacySection'
import { TransactionSection } from '@app/components/pages/profile/settings/TransactionSection/TransactionSection'
import { WalletSection } from '@app/components/pages/profile/settings/WalletSection'
import { useSubgraphMeta } from '@app/hooks/ensjs/subgraph/useSubgraphMeta'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { IS_DEV_ENVIRONMENT } from '@app/utils/constants'
import { getMiniAppEmbed } from '@app/utils/miniapp'

const OtherWrapper = styled.div(
  ({ theme }) => css`
    grid-area: other;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
  `,
)

export default function Page() {
  const { t } = useTranslation('settings')
  const router = useRouter()
  const { address, isConnecting, isReconnecting } = useAccount()
  const [isMiniApp, setIsMiniApp] = useState(false)
  const [hasCheckedMiniApp, setHasCheckedMiniApp] = useState(false)

  // We need at least one graph call on this page to ensure that SyncProvider can correctly determine if the
  // graph is erroring or not.
  const subgraphMeta = useSubgraphMeta()

  const isLoading = !router.isReady || isConnecting || isReconnecting || subgraphMeta.isLoading

  useEffect(() => {
    let cancelled = false

    sdk
      .isInMiniApp()
      .then((result) => {
        if (!cancelled) setIsMiniApp(result)
      })
      .finally(() => {
        if (!cancelled) setHasCheckedMiniApp(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useProtectedRoute('/', isLoading || !hasCheckedMiniApp ? true : isMiniApp || address)

  const miniAppEmbed = getMiniAppEmbed()

  return (
    <>
      <Head>
        <meta name="fc:miniapp" content={JSON.stringify(miniAppEmbed)} />
        <meta name="fc:frame" content={JSON.stringify(miniAppEmbed)} />
      </Head>
      <Content singleColumnContent title={t('title')}>
        {{
          trailing: (
            <OtherWrapper>
              <PrimarySection />
              <TransactionSection />
              <WalletSection />
              <PrivacySection />
              {IS_DEV_ENVIRONMENT && <DevSection />}
            </OtherWrapper>
          ),
        }}
      </Content>
    </>
  )
}
