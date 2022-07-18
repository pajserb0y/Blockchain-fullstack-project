const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with favourite number of zero", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = 0
        //assert
        //expect
        assert.equal(currentValue, expectedValue)
    })
    it("Should update when we call store", async function () {
        const transactoinResponse = await simpleStorage.store(7)
        await transactoinResponse.wait(1)
        const updatedValue = await simpleStorage.retrieve()
        const expectedValue = 7

        assert.equal(updatedValue, expectedValue)
        expect(updatedValue).to.equal(expectedValue) // same as assert
    })
})
