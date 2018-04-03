pragma solidity ^0.4.18;

import "zeppelin/contracts/math/SafeMath.sol";
import "zeppelin/contracts/lifecycle/Pausable.sol";
import "zeppelin/contracts/ReentrancyGuard.sol";
import "./ERC721Deed.sol";
import "./ERC721Metadata.sol";

/*
  Notes on this ERC721 implementation:

  A simple Bike deed.
 */

contract BikeDeed is ERC721Deed, Pausable, ReentrancyGuard {

  using SafeMath for uint256;


  /* Events */

  // When a dead is created by the contract owner.
  event Creation(uint256 indexed id, bytes32 indexed serialNumber, bytes32 indexed manufacturer, address owner, address custodian);

  // When a deed needs to be removed. The contract owner needs to own the deed in order to be able to destroy it.
  event Destruction(uint256 indexed id);


  /* The actual deeds */

  // The data structure of the Bike deed
  struct Bike {
    bytes32 name;
    bytes32 serialNumber;
    bytes32 manufacturer;
    address custodian;
    uint256 price;
    uint256 created;
    uint256 deleted;
  }

  // Mapping from _deedId to Bike
  //mapping (uint256 => Bike) private deeds;
  mapping (uint256 => Bike) public deeds;

  // Mapping from deed name to boolean indicating if the name is already taken
  mapping (bytes32 => bool) private deedNameExists;

  // Needed to make all deeds discoverable. The length of this array also serves as our deed ID.
  uint256[] private deedIds;


  /* Variables in control of owner */

  // The contract owner can change the initial price of deeds at Creation.
  uint256 private creationPrice = 0.01 ether;

  // The contract owner can change the base URL, in case it becomes necessary. It is needed for Metadata.
  string public url = "http://BikeBuddy.com/";

  // ERC-165 Metadata
  bytes4 internal constant INTERFACE_SIGNATURE_ERC165 = // 0x01ffc9a7
      bytes4(keccak256('supportsInterface(bytes4)'));

  bytes4 internal constant INTERFACE_SIGNATURE_ERC721 = // 0xda671b9b
      bytes4(keccak256('ownerOf(uint256)')) ^
      bytes4(keccak256('countOfDeeds()')) ^
      bytes4(keccak256('countOfDeedsByOwner(address)')) ^
      bytes4(keccak256('deedOfOwnerByIndex(address,uint256)')) ^
      bytes4(keccak256('approve(address,uint256)')) ^
      bytes4(keccak256('takeOwnership(uint256)'));

  bytes4 internal constant INTERFACE_SIGNATURE_ERC721Metadata = // 0x2a786f11
      bytes4(keccak256('name()')) ^
      bytes4(keccak256('symbol()')) ^
      bytes4(keccak256('deedUri(uint256)'));


  function BikeDeed() public {}

  // The contract owner can withdraw funds that were received this way.
  function() public payable {}

  modifier onlyExistingNames(uint256 _deedId) {
    require(deedNameExists[deeds[_deedId].name]);
    _;
  }

  modifier noExistingNames(bytes32 _serialNumber, bytes32 _manufacturer) {
    bytes32 _name = _buildName(_serialNumber, _manufacturer);
    require(!deedNameExists[_name]);
    _;
  }

  modifier notDeleted(uint256 _deedId) {
    require(deeds[_deedId].deleted == 0);
    _;
  }


   /* ERC721Metadata */

  function name()
  external pure returns (string) {
    return "BikeDeed";
  }

  function symbol()
  external pure returns (string) {
    return "BIKE";
  }

  function supportsInterface(bytes4 _interfaceID)
  external pure returns (bool) {
    return (
      _interfaceID == INTERFACE_SIGNATURE_ERC165
      || _interfaceID == INTERFACE_SIGNATURE_ERC721
      || _interfaceID == INTERFACE_SIGNATURE_ERC721Metadata
    );
  }

  function deedUri(uint256 _deedId)
  external view onlyExistingNames(_deedId) returns (string _uri) {
    _uri = _strConcat(url, _bytes32ToString(deeds[_deedId].name));
  }

  function deedName(uint256 _deedId)
  external view onlyExistingNames(_deedId) returns (string _name) {
    _name = _bytes32ToString(deeds[_deedId].name);
  }

  /* Enable listing of all deeds (alternative to ERC721Enumerable to avoid having to work with arrays). */
  function ids()
  external view returns (uint256[]) {
    return deedIds;
  }

  function deed(uint256 _deedId)
  external view returns (Bike) {
    return deeds[_deedId];
  }

  /* Owner Functions */

  // Anyone creates deeds. Newly created deeds are initialised with
  // a derived name, serialNumber, manufacturer, owner and a custodian.
  function create(bytes32 _serialNumber, bytes32 _manufacturer, address _owner, address _custodian)
  public noExistingNames(_serialNumber, _manufacturer) {
    bytes32 _name = _buildName(_serialNumber, _manufacturer);
    deedNameExists[_name] = true;
    uint256 deedId = deedIds.length;
    deedIds.push(deedId);
    super._mint(_owner, deedId);
    deeds[deedId] = Bike({
      name: _name,
      serialNumber: _serialNumber,
      manufacturer: _manufacturer,
      custodian: _custodian,
      price: creationPrice,
      created: now,
      deleted: 0
    });
    Creation(deedId, _serialNumber, _manufacturer, _owner, _custodian);
  }

  // Deeds can only be burned if the contract owner is also the deed owner. This ensures that the deed owner is reimbursed when the contract owner needs to remove a deed from the contract.
  function destroy(uint256 _deedId)
  public onlyOwner notDeleted(_deedId) {
    // We deliberately let the name stay in use, so that each name remains a unique identifier forever.

    // Iterating over an array of IDs is too expensive, so we mark the deed as deleted instead.
    deeds[_deedId].deleted = now;

    super._burn(_deedId);
    Destruction(_deedId);
  }

  function setCreationPrice(uint256 _price)
  public onlyOwner {
    creationPrice = _price;
  }

  function setUrl(string _url)
  public onlyOwner {
    url = _url;
  }

  /* Other publicly available functions */

  // Returns the last paid price for this deed.
  function priceOf(uint256 _deedId)
  public view notDeleted(_deedId) returns (uint256 _price) {
    _price = deeds[_deedId].price;
  }

  // Returns the current custodian of the deed.
  function custodianOf(uint256 _deedId)
  public view notDeleted(_deedId) returns (address _custodian) {
    _custodian = deeds[_deedId].custodian;
  }

  /* Private helper functions */
  function _buildName(bytes32 _serialNumber, bytes32 _manufacturer)
  private pure returns(bytes32) {
     return _stringToBytes32(_strConcat(_bytes32ToString(_serialNumber),
            _bytes32ToString(_manufacturer)));
  }

  function _bytes32ToString(bytes32 _bytes32)
  private pure returns (string) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
      byte char = byte(bytes32(uint(_bytes32) * 2 ** (8 * j)));
      if (char != 0) {
        bytesString[charCount] = char;
        charCount++;
      }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
      bytesStringTrimmed[j] = bytesString[j];
    }

    return string(bytesStringTrimmed);
  }

  function _stringToBytes32(string memory source)
  private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }

    assembly {
        result := mload(add(source, 32))
    }
  }

  function _strConcat(string _a, string _b)
  private pure returns (string) {
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    string memory ab = new string(_ba.length + _bb.length);
    bytes memory bab = bytes(ab);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
    return string(bab);
  }

}
