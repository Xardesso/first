const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("deploying contract")
    const SimpleStorage = await SimpleStorageFactory.deploy()
    await SimpleStorage.deployed()
    console.log(`deployed contract to :${SimpleStorage.address}`)
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log(`waiting for block txs`)

        await SimpleStorage.deployTransaction.wait(6)
        await verify(SimpleStorage.address, [])
    }
    const currentValue = await SimpleStorage.retrieve()
    console.log(`current value is: ${currentValue}`)
    const transactrionResponse = await SimpleStorage.store(7)
    await transactrionResponse.wait(1)
    const updateValue = await SimpleStorage.retrieve()
    console.log(`updated value is: ${updateValue}`)
}
async function verify(contractAddress, args) {
    console.log("veryfing contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("alredy veryfied")) {
            console.log("aleredy verified")
        } else {
            console.log(e)
        }
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
