const defaultMiniAppOrigin = 'https://app.ens.domains'

const getMiniAppOrigin = (origin?: string) =>
  (
    origin ||
    process.env.NEXT_PUBLIC_MINIAPP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    defaultMiniAppOrigin
  ).replace(/\/$/, '')

export const miniAppConfig = {
  name: 'ENS',
  buttonTitle: 'Set primary',
  splashBackgroundColor: '#F7F7F7',
  homePath: '/my/settings',
  iconPath: '/miniapp/icon.png',
  previewPath: '/miniapp/preview.svg',
}

export const getMiniAppUrls = (origin?: string) => {
  const miniAppOrigin = getMiniAppOrigin(origin)

  return {
    origin: miniAppOrigin,
    homeUrl: `${miniAppOrigin}${miniAppConfig.homePath}`,
    iconUrl: `${miniAppOrigin}${miniAppConfig.iconPath}`,
    previewUrl: `${miniAppOrigin}${miniAppConfig.previewPath}`,
  }
}

export const getMiniAppEmbed = (origin?: string) => {
  const urls = getMiniAppUrls(origin)

  return {
    version: '1',
    imageUrl: urls.previewUrl,
    button: {
      title: miniAppConfig.buttonTitle,
      action: {
        type: 'launch_miniapp',
        name: miniAppConfig.name,
        url: urls.homeUrl,
        splashImageUrl: urls.iconUrl,
        splashBackgroundColor: miniAppConfig.splashBackgroundColor,
      },
    },
  }
}

export const getMiniAppManifest = (origin?: string) => {
  const urls = getMiniAppUrls(origin)

  return {
    accountAssociation: {
      header: process.env.FARCASTER_ACCOUNT_ASSOCIATION_HEADER || '',
      payload: process.env.FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD || '',
      signature: process.env.FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE || '',
    },
    miniapp: {
      version: '1',
      name: miniAppConfig.name,
      iconUrl: urls.iconUrl,
      homeUrl: urls.homeUrl,
      imageUrl: urls.previewUrl,
      buttonTitle: miniAppConfig.buttonTitle,
      splashImageUrl: urls.iconUrl,
      splashBackgroundColor: miniAppConfig.splashBackgroundColor,
      subtitle: 'Name your wallet',
      description: 'Set a primary ENS name for your Farcaster connected wallet.',
      primaryCategory: 'utility',
      tags: ['ens', 'identity', 'wallet'],
      ogTitle: 'ENS',
      ogDescription: 'Set your primary ENS name from Farcaster.',
      ogImageUrl: urls.previewUrl,
      requiredChains: ['eip155:1'],
      requiredCapabilities: ['wallet.getEthereumProvider'],
    },
  }
}
