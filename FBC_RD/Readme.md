<p align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="100" src="./fbg.png" alt="FBG logo"></a></p>

<p align="center">
  <a href="https://circleci.com/gh/vuejs/vue/tree/dev"><img src="https://img.shields.io/circleci/project/github/vuejs/vue/dev.svg?sanitize=true" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/vue"><img src="https://img.shields.io/npm/l/vue.svg?sanitize=true" alt="License"></a>
  <a href="https://app.saucelabs.com/builds/50f8372d79f743a3b25fb6ca4851ca4c"><img src="https://app.saucelabs.com/buildstatus/vuejs" alt="Build Status"></a>
</p>

<h2 align="center">Fire Basis Cash</h2>

## Introduction

Fire Basis is an algorithmic stable coin protocol where the money supply is dynamically adjusted to meet changes in money demand.

When demand is rising, the blockchain will create more Fire Basis Cash. The expanded supply is designed to bring the Basis price back down.
When demand is falling, the blockchain will buy back Fire Basis Cash. The contracted supply is designed to restore Fire Basis price.
The basis protocol is designed to expand and contract supply similarly to the way central banks buy and sell fiscal debt to stabilize purchasing power. For this reason, we refer to Fire Basis Cash as having an algorithmic central bank.

## The Fire Basis Cash Protocol

Basis Cash differs from the original Basis Project in several meaningful ways: 

1. **Rationally simplified** - several core mechanisms of the Basis protocol has been simplified, especially around bond issuance and seigniorage distribution. We've thought deeply about the tradeoffs for these changes, and believe they allow significant gains in UX and contract simplicity, while preserving the intended behavior of the original monetary policy design. 
2. **Censorship resistant** - we launch this project anonymously, protected by the guise of characters from the popular SciFi series Rick and Morty. We believe this will allow the project to avoid the censorship of regulators that scuttled the original Basis Protocol, but will also allow Basis Cash to avoid founder glorification & single points of failure that have plagued so many other projects. 
3. **Fairly distributed** - both Basis Shares and Basis Cash has zero premine and no investors - community members can earn the initial supply of both assets by helping to contribute to bootstrap liquidity & adoption of Basis Cash. 

### A Four-token System

There exists three types of assets in the Fire Basis Cash system. 

- **Fire Basis Cash ($FBC)**: a stablecoin, which the protocol aims to keep value-pegged to 1 US Dollar. 
- **Fire Basis Bonds ($FBB)**: IOUs issued by the system to buy back Fire Basis Cash when price($FBC) < $1. Bonds are sold at a meaningful discount to price($FBC), and redeemed at $1 when price($FBC) normalizes to $1. 
- **Fire Basis Shares ($FBS)**: receives surplus seigniorage (seigniorage left remaining after all the bonds have been redeemed).
- **Fire Basis Goverance ($FBG)**: the fire basis governance token,which can accelerate the speed of mining and get more priority in boardroom.

### Stability Mechanism

- **Contraction**: When the price($FBC) < ($1 - epsilon), users can trade in $BAC for $FBB at the BABBAC exchange rate of price($FBC). This allows bonds to be always sold at a discount to cash during a contraction.
- **Expansion**: When the price($FBC) > ($1 + epsilon), users can trade in 1 $FBB for 1 $FBC. This allows bonds to be redeemed always at a premium to the purchase price. 
- **Seigniorage Allocation**: If there are no more bonds to be redeemed, (i.e. bond Supply is negligibly small), more $FBC is minted totalSupply($FBC) * (price($FBC) - 1), and placed in a pool for $FBS holders to claim pro-rata in a 24 hour period. 

Visit our official website [Fire Basis Cash](https://firebasis.com).

## Questions and Contribution

To chat with us & stay up to date, join our [Telegram](https://t.me/hecofire).

Join us on [Medium](https://firebasis.medium.com).


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2013-present
