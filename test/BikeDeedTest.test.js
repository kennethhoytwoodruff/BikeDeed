import assertRevert from './helpers/assertRevert';
const BigNumber = web3.BigNumber;
const BikeDeed = artifacts.require('BikeDeed.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('BikeDeed', accounts => {
  let deed = null;
  const _unknownDeedId = 999;

  const _creator = accounts[0];
  const _firstOwner = accounts[1];
  const _secondOwner = accounts[2];
  const _thirdOwner = accounts[3];
  const _unrelatedAddr = accounts[4];

  const _serialNumber1 = "WSBC973528365"
  const _serialNumber2 = "M1024"
  const _serialNumber3 = "LTS7300927"
  const _deletedSerialNumber = "LTS4530957"

  const _manufacturer1 = "S25"; //"Specialized";
  const _manufacturer2 = "M20"; //"Moots Cycles";
  const _manufacturer3 = "S02"; //"Santa Cruz Bicycles";


  const _deedUrl = "http://ipfs.io/ipfs/";

  const _ipfsHash1 = "QmTsx8byxDXaZV5pcNsaoctctibJqm5H3jmZ6XeSgH2RRD";
  const _ipfsHash2 = "QmPB7wCgU35yt2uJ1ynsEYM9jQxLnYDAPEjpZoVWCV7yqj";
  const _ipfsHash3 = "QmcY3N16r4GSNkgJPJiQjKxYVTrB27yzqPAgVonqVpMq5r";
  const _ipfsHash4 = "QmeJ7qTAuViHztHs1RqGHvAgRtnJwQfEu1Kjt5hWbPJVfj";

  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach(async function () {
    deed = await BikeDeed.new({ from: _creator });
    deed.setUrl(_deedUrl);
    await deed.create(_serialNumber1, _manufacturer1, _ipfsHash1, _firstOwner);
    await deed.create(_serialNumber2, _manufacturer2, _ipfsHash2, _secondOwner);
    await deed.create(_serialNumber3, _manufacturer3, _ipfsHash3, _secondOwner);
    await deed.create(_deletedSerialNumber, _manufacturer3, _ipfsHash4, _creator);
  });

  describe('verify', function () {

    describe('verifyOwnerOf', function () {
      it('verify deed creation', async function () {
        let owner1 = await deed.ownerOf(0);
        assert.equal(owner1, _firstOwner);
        let owner2 = await deed.ownerOf(1);
        assert.equal(owner2, _secondOwner);
        let owner3 = await deed.ownerOf(2);
        assert.equal(owner3, _secondOwner);
        });
      });

    describe('verifyIpfsHash', function () {
      it('verify ipfsHash existence', async function () {
        let ipfs1 = await deed.deedUri(0);
        assert.equal(ipfs1, (_deedUrl + _ipfsHash1));
        let ipfs2 = await deed.deedUri(1);
        assert.equal(ipfs2, (_deedUrl + _ipfsHash2));
        let ipfs3 = await deed.deedUri(2);
        assert.equal(ipfs3, (_deedUrl + _ipfsHash3));
        });
      });

    describe('verifyCount', function () {
      it('verify count of deeds by owner', async function () {
        let count = await deed.countOfDeedsByOwner(_secondOwner);
        assert.equal(count, 2, 'test failed');
        });
      });

    describe('verifyNames', function () {
      it('verify name of deeds', async function () {
        let name1 = await deed.deedName(0);
        assert.equal(name1, (_serialNumber1 + _manufacturer1));
        let name2 = await deed.deedName(1);
        assert.equal(name2, (_serialNumber2 + _manufacturer2));
        let name3 = await deed.deedName(2);
        assert.equal(name3, (_serialNumber3 + _manufacturer3));
        });
      });
    });

  describe('destroy', function () {
    describe('when the given id exists', function () {
      it('marks the deed as deleted', async function () {
        let countOfDeeds = await deed.countOfDeeds();
        countOfDeeds.should.be.bignumber.equal(4);
        let count = await  deed.countOfDeedsByOwner(_creator);
        let deedId = await deed.deedOfOwnerByIndex(_creator, --count);
        await deed.destroy(deedId);
        countOfDeeds = await deed.countOfDeeds();
        countOfDeeds.should.be.bignumber.equal(3);
      });
    });

    describe('when the given id does not exist', function () {
      it('reverts', async function () {
        await assertRevert(deed.destroy(_unknownDeedId));
      });
    });
  });

});
