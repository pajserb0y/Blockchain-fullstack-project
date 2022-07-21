//in nodejs
//require()

//in front-end javascript you can't use require
//import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

fundButton.onclick = fund
connectButton.onclick = connect
balanceButton.onclick = balance
withdrawButton.onclick = withdraw
console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected!"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please intall metamask"
    }
}

//fund function

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        console.log(`Funding with ${ethAmount}...`)
        //provider / connection to the blockchain
        //signer /wallet / someone with some gas
        //contract that wa are interactiong with
        //^ABI & Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            //listen to the tx to be mined
            await listenForTransactionMined(transactionResponse, provider) // stop here unitl ths tx comletly done
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}

async function balance() {
    if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(`Balance is ${ethers.utils.formatEther(balance)}`)
        document.getElementById("balance").value = balance
    }
}

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash} ...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

//withdraw

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log(`Withdrawing...`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            //listen to the tx to be mined
            await listenForTransactionMined(transactionResponse, provider) // stop here unitl ths tx comletly done
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}
