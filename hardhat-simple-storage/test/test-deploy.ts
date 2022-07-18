import { ethers } from "hardhat"
import { assert, expect } from "chai"
import {SimpleStorage, SimpleStorage__factory} from  "../typechain-types"
import { BigNumber } from "ethers"

describe("SimpleStorage", function () {
    let simpleStorageFactory: SimpleStorage__factory, simpleStorage: SimpleStorage
    beforeEach(async function () {
        simpleStorageFactory = (await ethers.getContractFactory("SimpleStorage")) as SimpleStorage__factory
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with favourite number of zero", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        //assert
        //expect
        assert.equal(currentValue.toString(), expectedValue)
    })
    it("Should update when we call store", async function () {
        const transactoinResponse = await simpleStorage.store(7)
        await transactoinResponse.wait(1)
        const updatedValue = await simpleStorage.retrieve()
        const expectedValue = "7"

        assert.equal(updatedValue.toString(), expectedValue)
        expect(updatedValue).to.equal(expectedValue) // same as assert
    })

    // it("Should add person", async function () {
    //     const transactoinResponse = await simpleStorage.addPerson("Marko", 3)
    //     await transactoinResponse.wait(1)
    //     people = await simpleStorage.people
    //     const nameToFavoriteNumber = await simpleStorage.nameToFavoriteNumber
    //     console.log(people)
    //     console.log(nameToFavoriteNumber)
    //     //assert.equal(people[0].name, "Marko")
    //     // assert.equal(nameToFavouriteNumber["Marko"], 3)
    // })
})
