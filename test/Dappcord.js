const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
describe("Dappcord", function () {
  let deploy;
  let channel;
  let deployer,user;
  const NAME = "Dappcord";
  const SYMBOL= "DC";
  beforeEach(async () => {
    //set account
    [deployer,user] = await ethers.getSigners()
    //deploy contract
    const Dappcord = await ethers.getContractFactory("Dappcord")
    deploy = await Dappcord.deploy(NAME,SYMBOL)
    channel = await deploy.connect(deployer).createChannel("dev",tokens(1))
    await channel.wait()
  })
    describe("Deployement", () => {
      it("check the name", async () => {
        //fetch name
        let result = await deploy.name()
        expect(result).to.be.equal(NAME)// check name
      })
      it("check the Symbol", async () => {

        //fetch symbol
        let result = await deploy.symbol()
        expect(result).to.be.equal(SYMBOL)// check the symbol
      })
      it("check ownership",async ()=>{
        const account = await deploy.owner()
        expect(account).to.equal(deployer.address)
      })
    })
    describe("Create channel", () => {
      it("Buying Channel", async()=>{
        let result = await deploy.getChannel(1)
        expect(result.id).to.equal(1)
        expect(result.name).to.equal("dev")

      })
    })
    describe("minting",()=>{
      const ID = 1;
      const AMOUNT = ethers.utils.parseUnits("1",'ether')
      beforeEach(async()=>{
        const transaction = await deploy.connect(user).mint(ID,{value:AMOUNT})
        await transaction.wait()
      })
      it("join user", async()=>{
        const result = await deploy.hasJoined(ID,user.address )
        expect(result).to.equal(true)
      })
      it("increase total supply", async()=>{
        const result = await deploy.TotalSupply()
        expect(result).to.equal(ID)
      })
      it("update contract balance",async()=>{
        const result = await ethers.provider.getBalance(deploy.address)
        expect(result).to.equal(AMOUNT)
      })
    })
    describe("withdraw",()=>{
      const ID = 1;
      const AMOUNT = ethers.utils.parseUnits("1",'ether')
      beforeEach(async()=>{
        
        beforeWithdraw = await ethers.provider.getBalance(deployer.address)
        let transaction = await deploy.connect(user).mint(ID,{value:AMOUNT})
        await transaction.wait()
        transaction = await deploy.connect(deployer).withdraw()
        await transaction.wait
      })
      it("money withdraw", async()=>{
        const result = await ethers.provider.getBalance(deployer.address)
        expect(result).to.be.greaterThan(beforeWithdraw);
      })
      
    })
})
