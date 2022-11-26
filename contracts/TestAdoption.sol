pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption{
    // alamat contract adopsi yang akan ditest
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    // id pet yang digunakan untuk ngetest
    uint expectedPetId = 8;

    // pemilik dari pet yang diadopsi adalah kontrak ini
    address expectedAdopter = address(this);

    // test fungsi adopt dari Adoption.sol
    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(expectedPetId);

        Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
    }

    // test untuk mengapatkan pemilik pet berdasarkan id pet
    function testGetAdopterAddressByPetId() public {
        address adopter = adoption.adopters(expectedPetId);

        Assert.equal(adopter, expectedAdopter,"Owner of the expected pet should be this contract");
    }

    // test untuk mendapatkan semua pemilik pet dalam array
    function testGetAdopterAddressByPetInArray() public{
        // keyword memory digunakan untuk menyimpan nilai sementara
        // tanpa memory maka akan disimpan di storage contract
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
    }
}