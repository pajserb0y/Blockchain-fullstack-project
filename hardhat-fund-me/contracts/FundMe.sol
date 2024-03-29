//Get funds from users
//Withdraw funds
//Set a Minimum funding value in USD

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//FUNCTIONS ORDER:
//CONSTRUCTOR
//RECEIVE
//FALLBACK
//EXTERNAL
//PUBLIC
//INTERNAL
//PRIVATE
//VIEW/PURE

error FundMe__NotOwner();

/// @title Contract for crowd funding
/// @author Marko Nikolic
/// @notice This contract is to demo a ample funding contract
/// @dev This implements price feeds as our library
contract FundMe {
    //Type declarations
    using PriceConverter for uint256;

    //STATE VARIABLES (STORAGE VARIABLES)
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    //less gas with constant
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    address private immutable i_owner;
    //less gas with immutable
    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        // require(msg.sender == i_owner,"Only owner can withdraw money");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _; //this is where resto of the code of original function is going, it can also go before
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender; //msg.sender = one that deploys contract, for first time
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //If someone wants to send money to contract without fundMe
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /// @notice This function funds this contract
    /// @dev This implements price feeds as out library
    function fund() public payable {
        //set minimum fund amout of USD
        // 1.How do we send ETH to this contract
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Didn't send enough ETH"
        ); //1e18 == 1 * 10^18
        //if condition is not met, require reverts everything done in the function!!!
        //everythong before require spends gas, but for everything after gas is returned!!!
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        //transfer
        //msg,sender = address
        //payable(msg.sender) = payable address
        // payable(msg.sender).transfer(address(this).balance);
        //send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        //call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call Failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        //mapings can't be in memmory

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "Call failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
