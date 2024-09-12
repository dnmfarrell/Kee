// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Kee {
    /**
     * mints new keys, takes a byte-encoded string (label) and a tightly packed set of addresses.
     * The data is stored in calldata and unprocessed to minimize gas.
     *
     */
    function mint(bytes32, bytes calldata) external {
        // no-op
    }

    /**
     * Converts its args into values suitable to mint().
     *
     * The string label is encoded into bytes32 and truncated if too long.
     * It tightly packs the array of addresses into bytes.
     */
    function pack(
        string calldata label,
        address[] calldata addrs
    ) external pure returns (bytes32, bytes memory) {
        bytes32 labelEncoded = bytes32(abi.encodePacked(label));
        bytes memory packed;
        for (uint256 i = 0; i < addrs.length; i++) {
            packed = bytes.concat(packed, bytes20(addrs[i]));
        }
        return (labelEncoded, packed);
    }

    /**
     * Decodes the data returned by pack() back into their original types.
     *
     */
    function unpack(
        bytes32 label,
        bytes memory addrs
    ) external pure returns (string memory, address[] memory) {
        uint8 length = 32;
        for (uint8 i = 0; i < 32; i++) {
            if (label[i] == 0) {
                length = i;
                break;
            }
        }
        bytes memory byteArray = new bytes(length);
        for (uint8 i = 0; i < length; i++) {
            byteArray[i] = label[i];
        }
        uint256 numAddrs = addrs.length / 20;
        address[] memory unpacked = new address[](numAddrs);
        for (uint256 i = 0; i < numAddrs; i++) {
            bytes memory addr = new bytes(20);
            for (uint256 j = 0; j < 20; j++) {
                addr[j] = addrs[20 * i + j];
            }
            unpacked[i] = address(bytes20(addr));
        }
        return (string(byteArray), unpacked);
    }
}
