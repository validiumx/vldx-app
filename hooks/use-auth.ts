"use client"

import { useWalletAuth } from "./use-wallet-auth"

export const useAuth = () => {
  // Remove old state and logic
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [user, setUser] = useState<any>(null)
  // const [isLoading, setIsLoading] = useState(false)
  // const { isInstalled } = useMiniKit()

  // Use wallet auth hook
  const {
    user,
    isLoading,
    isAuthenticating,
    error,
    isAuthenticated,
    signIn,
    signOut,
    refreshUser,
    getUserByAddress,
    getUserByUsername,
    checkAuthStatus,
  } = useWalletAuth()

  // login and logout wrappers for compatibility
  const login = signIn
  const logout = signOut

  return {
    isAuthenticated,
    user,
    isLoading: isLoading || isAuthenticating,
    login,
    logout,
    refreshUser,
    getUserByAddress,
    getUserByUsername,
    checkAuthStatus,
    error,
  }
}
