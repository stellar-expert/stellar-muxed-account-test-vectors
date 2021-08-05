# Test vectors for muxed account

See [CAP-27](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0027.md) for the reference.

Run

```shell
npx https://github.com/stellar-expert/stellar-muxed-account-test-vectors
```

### Test vectors

- `Operation::sourceAccount` (for all op types)
- `Transaction::sourceAccount`
- `FeeBumpTransaction::feeSource`
- `PaymentOp::destination`
- `PathPaymentStrictReceiveOp::destination`
- `PathPaymentStrictSendOp::destination`
- `AccountMerge::destination`
- Compound tests - different muxed accounts in `Transaction::sourceAccount`, `FeeBumpTransaction::feeSource`, and two operations `Operation::sourceAccount` – all with different accounts and muxed ids
- Test everything with id=`uint64.maxValue-1` and id=`0` to check overflows and correct parsing

Generated transaction example: [732c48dbf8dd87c9079813bfc9e9d83b863910e17fb5f27bc823c731d038427d](https://stellar.expert/explorer/testnet/tx/732c48dbf8dd87c9079813bfc9e9d83b863910e17fb5f27bc823c731d038427d) (temporary, will be deleted on the next testnet reset)

### Notes

- `AllowTrust` can have muxed account as source, meaning that the asset is muxed.
- Unclear semantics for creating offers on behalf of a muxed account, changing account settings, storing data entries, etc.