// Safe wrapper around window.haptics (WebHaptics global from haptics.lochie.me)
// All methods are no-ops on desktop or when the script hasn't loaded

type HapticsGlobal = {
  nudge?: () => void
  success?: () => void
  warning?: () => void
  error?: () => void
}

function getHaptics(): HapticsGlobal {
  if (typeof window === 'undefined') return {}
  return (window as unknown as { haptics?: HapticsGlobal }).haptics ?? {}
}

const haptics = {
  nudge: () => getHaptics().nudge?.(),
  success: () => getHaptics().success?.(),
  warning: () => getHaptics().warning?.(),
  error: () => getHaptics().error?.(),
}

export default haptics
