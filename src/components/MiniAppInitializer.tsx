import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

export const MiniAppInitializer = () => {
  const { isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors, status } = useConnect()

  useEffect(() => {
    let cancelled = false

    const markReady = async () => {
      try {
        const isMiniApp = await sdk.isInMiniApp()
        if (cancelled || !isMiniApp) return

        const farcasterConnector = connectors.find(({ id }) => id === 'farcaster')
        if (
          farcasterConnector &&
          !isConnected &&
          !isConnecting &&
          !isReconnecting &&
          status !== 'pending'
        ) {
          connect({ connector: farcasterConnector })
        }

        await sdk.actions.ready()
      } catch {
        // Outside Farcaster, this app should behave exactly like the normal web app.
      }
    }

    markReady()

    return () => {
      cancelled = true
    }
  }, [connect, connectors, isConnected, isConnecting, isReconnecting, status])

  return null
}
