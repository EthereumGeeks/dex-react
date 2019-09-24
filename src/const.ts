import BN from 'bn.js'

// Some convenient numeric constant
export const ZERO = new BN(0)
export const ONE = new BN(1)
export const TWO = new BN(2)

// Max allowance value for ERC20 approve
export const ALLOWANCE_VALUE = new BN(2).pow(new BN(256)).sub(ONE)

// Model constants
export const FEE_DENOMINATOR = 1000 // Fee is 1/fee_denominator i.e. 1/1000 = 0.1%
export const BATCH_TIME = 300