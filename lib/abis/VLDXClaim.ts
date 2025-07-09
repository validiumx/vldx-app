export const VLDXClaimABI = [
  // View functions
  "function minClaim() view returns (uint256)",
  "function getCurrentMaxClaim() view returns (uint256)",
  "function lastClaimTime(address user) view returns (uint256)",
  "function canClaim(address user) view returns (bool)",
  "function getClaimCooldown() view returns (uint256)",
  "function totalUsers() view returns (uint256)",
  "function userClaimed(address user) view returns (bool)",

  // Main claim function
  "function claim(uint256 amount) external",

  // Events
  "event Claimed(address indexed user, uint256 amount, uint256 timestamp)",
  "event PhaseChanged(uint256 newPhase, uint256 newMaxClaim)",

  // Error events for better error handling
  "error InsufficientAmount(uint256 provided, uint256 minimum)",
  "error ExcessiveAmount(uint256 provided, uint256 maximum)",
  "error ClaimTooSoon(uint256 timeLeft)",
  "error AlreadyClaimed(address user)",
] as const

export const VLDX_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
] as const
