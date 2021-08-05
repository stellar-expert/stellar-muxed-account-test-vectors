const {generateMuxedTestVectors} = require('./muxed-test-vectors');

(async function main() {
    try {
        console.log('Test vectors generator - Muxed accounts')
        console.log('=======================================')
        await generateMuxedTestVectors()

    } catch (e) {
        console.error(e)
    }
})()