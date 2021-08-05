const {Keypair, StrKey, MuxedAccount} = require('stellar-sdk'),
    axios = require('axios')

async function createSourceAccount() {
    console.log('Creating and funding source account...')
    const pair = Keypair.random()
    await axios.get(`https://friendbot.stellar.org?addr=${pair.publicKey()}`)
    console.log(`✓ - ${pair.publicKey()} created and funded`)
    return pair
}

module.exports = {createSourceAccount}