const {createSourceAccount} = require('./create-source-account')
const {
    Server,
    TransactionBuilder,
    MuxedAccount,
    Operation,
    Networks,
    Asset,
    Account,
    Keypair,
    Claimant,
    BASE_FEE
} = require('stellar-sdk')


async function generateMuxedTestVectors() {
    const horizon = new Server('https://horizon-testnet.stellar.org'),
        networkPassphrase = Networks.TESTNET

    const sourceKeypair1 = await createSourceAccount(),
        sourceKeypair2 = await createSourceAccount(),
        destKeypair = Keypair.random()

    console.log('Creating test transaction with a combination of muxed accounts...')
    const sourceAccount1 = await horizon.loadAccount(sourceKeypair1.publicKey()),
        sourceAccount2 = await horizon.loadAccount(sourceKeypair2.publicKey()),
        destAccount = new Account(destKeypair.publicKey(), '1')

    const tx = new TransactionBuilder(new MuxedAccount(sourceAccount1, '18446744073709551615'), {
        fee: (3 * BASE_FEE).toString(),
        networkPassphrase,
        withMuxing: true
    })
        .enableMuxedAccounts()
        .addOperation(Operation.createAccount({
            source: new MuxedAccount(sourceAccount1, '0').accountId(),
            destination: destKeypair.publicKey(),
            startingBalance: '10',
            withMuxing: true
        }))
        .addOperation(Operation.payment({
            destination: new MuxedAccount(destAccount, '1').accountId(),
            asset: Asset.native(),
            amount: '10',
            withMuxing: true
        }))
        .addOperation(Operation.pathPaymentStrictReceive({
            source: new MuxedAccount(sourceAccount1, '2').accountId(),
            destination: new MuxedAccount(destAccount, '2').accountId(),
            sendAsset: Asset.native(),
            destAsset: Asset.native(),
            destAmount: '10',
            sendMax: '10',
            withMuxing: true
        }))
        .addOperation(Operation.changeTrust({
            source: new MuxedAccount(sourceAccount1, '6').accountId(),
            asset: new Asset('TMP', destKeypair.publicKey()),
            withMuxing: true
        }))
        .addOperation(Operation.manageSellOffer({
            source: new MuxedAccount(sourceAccount1, '3').accountId(),
            amount: '10',
            buying: new Asset('TMP', destKeypair.publicKey()),
            selling: Asset.native(),
            price: 1,
            withMuxing: true
        }))
        .addOperation(Operation.createPassiveSellOffer({
            source: new MuxedAccount(sourceAccount1, '4').accountId(),
            amount: '10',
            buying: new Asset('TMP', destKeypair.publicKey()),
            selling: Asset.native(),
            price: 1.1,
            withMuxing: true
        }))
        .addOperation(Operation.setOptions({
            source: new MuxedAccount(sourceAccount1, '5').accountId(),
            homeDomain: '-',
            withMuxing: true
        }))
        .addOperation(Operation.manageData({
            source: new MuxedAccount(sourceAccount1, '10').accountId(),
            name: 'tmp',
            value: 'tmp',
            withMuxing: true
        }))
        .addOperation(Operation.bumpSequence({
            source: new MuxedAccount(sourceAccount1, '11').accountId(),
            bumpTo: '8446744073709551615',
            withMuxing: true
        }))
        .addOperation(Operation.manageBuyOffer({
            source: new MuxedAccount(sourceAccount1, '12').accountId(),
            buyAmount: '10',
            buying: new Asset('TMP', destKeypair.publicKey()),
            selling: Asset.native(),
            price: 1.2,
            withMuxing: true
        }))
        .addOperation(Operation.pathPaymentStrictSend({
            destination: new MuxedAccount(destAccount, '13').accountId(),
            sendAsset: Asset.native(),
            destAsset: Asset.native(),
            sendAmount: '10',
            destMin: '10',
            withMuxing: true
        }))
        .addOperation(Operation.createClaimableBalance({
            source: new MuxedAccount(sourceAccount1, '14').accountId(),
            amount: '10',
            asset: Asset.native(),
            claimants: [new Claimant(sourceKeypair1.publicKey(), Claimant.predicateUnconditional())],
            withMuxing: true
        }))
        .addOperation(Operation.accountMerge({
            source: new MuxedAccount(sourceAccount2, '8').accountId(),
            destination: new MuxedAccount(destAccount, '8').accountId(),
            withMuxing: true
        }))
        .setTimeout(180)
        .build()
    tx.sign(sourceKeypair1)
    tx.sign(sourceKeypair2)
    const bump = TransactionBuilder.buildFeeBumpTransaction(new MuxedAccount(sourceAccount2, '18446744073709551615').accountId(), (6 * BASE_FEE).toString(), tx, networkPassphrase, true)
    bump.sign(sourceKeypair2)
    // Sign the transaction to prove you are actually the person sending it.

    try {
        const res = await horizon.submitTransaction(bump)
        console.log(`✓ - Test transaction with muxed accounts submitted. Tx hash: ${res.hash}`)
        console.log(`https://stellar.expert/explorer/testnet/tx/${res.hash}`)
    } catch (e) {
        if (e.response && e.response.status === 400 && e.response.data.extras) {
            console.error(`Transaction failed with result code ${JSON.stringify(e.response.data.extras.result_codes, null, '  ')}`)
            return
        }
        console.error('Test transaction failed', e)
    }
}

module.exports = {generateMuxedTestVectors}