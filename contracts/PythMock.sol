// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

contract PythMock {
    mapping(bytes32 => PythStructs.Price) private prices;

    function getPriceUnsafe(bytes32 priceId) external view returns (PythStructs.Price memory) {
        return prices[priceId];
    }

    function setPrice(bytes32 priceId, int64 price, uint64 conf, int32 expo, uint publishTime) external {
        prices[priceId] = PythStructs.Price(
            price,
            conf,
            expo,
            publishTime
        );
    }
}