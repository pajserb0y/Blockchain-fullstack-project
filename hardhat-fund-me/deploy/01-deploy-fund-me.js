// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
// same as hre.getNamedAccounts and hre.deployments
// same as the below
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
}
