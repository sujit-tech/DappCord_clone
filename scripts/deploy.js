const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners()
  const NAME = "Dappcord";
  const SYMBOL = "DC";
  const Dappcord = await ethers.getContractFactory("Dappcord")
  const deploy = await Dappcord.deploy(NAME, SYMBOL)
  await deploy.deployed()
  console.log(`deployed at: ${deploy.address}`)
  const channel = ["Anime", "NATgeo", "Music"]
  const cost = [tokens(1), tokens(0), tokens(0.25)]
  for (let i = 0; i < 3; i++) {
    let transaction = await deploy.connect(deployer).createChannel(channel[i], cost[i])
    await transaction.wait()
    console.log(`channel Created: ${channel[i]}`)

  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});