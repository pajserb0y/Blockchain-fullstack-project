//these are used mainly for local testing and hardhat/localhost network
//when in need for external blockchain contracts which are not available on local network
//so we mock them
const { getNamedAccounts, deployments, network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed!")
        log(
            "-----------------------------------------------------------------------------------------------"
        )
    }
}

module.exports.tags = ["all", "mocks"] //when running "yarn hardhat deploy --tags mocks" you can pass "mocks" tag to only run this script
