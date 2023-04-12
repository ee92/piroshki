// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "hardhat/console.sol";

interface IIcosa {
    function totalSupply() external view returns (uint256 supply);
}

interface IHedron {
    function totalSupply() external view returns (uint256 supply);

    function balanceOf(address owner) external view returns (uint256 supply);
}

struct Stake {
    string id;
    uint16 startDay;
}

contract Piroshki {
    IIcosa private _icsa;
    IHedron private _hdrn;

    uint256 private constant _decimalResolution = 1e18;
    address private constant _icsaAddress =
        address(0xfc4913214444aF5c715cc9F7b52655e788A569ed);
    address private constant _hdrnAddress =
        address(0x3819f64f282bf135d62168C1e513280dAF905e06);

    mapping(address => mapping(address => Stake)) private hdrnStakes;
    mapping(address => mapping(address => Stake)) private icsaStakes;

    constructor() {
        _icsa = IIcosa(_icsaAddress);
        _hdrn = IHedron(_hdrnAddress);
    }

    function _getMaxNumberOfMinLengthStakes(
        uint256 hedronAmount
    ) internal view returns (uint256) {
        return (hedronAmount * _decimalResolution) / _hdrn.totalSupply();
    }

    function createHedronStakes(
        uint256 amount
    ) external view returns (uint256) {
        require(_hdrn.balanceOf(msg.sender) >= amount, "HDRN: BALANCE TOO LOW");
        uint256 test = _getMaxNumberOfMinLengthStakes(amount);
        console.log("wtf", test);
        return test;
    }
}
