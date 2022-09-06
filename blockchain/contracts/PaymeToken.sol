// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

//Note: Token is Mintable due to the ERC20Capped Inheritence
contract PaymeToken is ERC20Capped, Ownable, ERC20Pausable {

  using SafeMath for uint256;

  uint256 constant MAXIMUMSUPPLY = 5*10**9*10**18;

  uint256 private _team_percent = 20;

  uint256 private _liquidity = 35;

  uint256 public provided_liquidity = _liquidity.mul(MAXIMUMSUPPLY.div(1000));

  uint256 public team_share = _team_percent.mul(MAXIMUMSUPPLY.div(100));

  uint256 private _preMintToken = provided_liquidity.add(team_share);

  constructor() ERC20("DaveMe", "PMe") ERC20Capped(MAXIMUMSUPPLY) {
      _mint(msg.sender, MAXIMUMSUPPLY);
  }

  //  function hh() public view returns(uint256 i) {
  //   uint256 i = _liquidity.mul(MAXIMUMSUPPLY.div(1000));
  //   return i;
  // }

  //  function mint(address to, uint256 amount) override(ERC20) internal    {
  //   //require(controllers[msg.sender], "Only controllers can mint");
  //   // require((MAXSUP+amount)<=MAXIMUMSUPPLY,"Maximum supply has been reached");
  //   // _totalSupply = _totalSupply.add(amount);
  //   // MAXSUP=MAXSUP.add(amount);
  //    super._mint(to, amount);
  //  }

  function _mint(address account, uint256 amount) override(ERC20, ERC20Capped) internal  {
    super._mint(account, amount);
  }


  function _beforeTokenTransfer(address from, address to, uint256 amount) override(ERC20, ERC20Pausable) internal {
    super._beforeTokenTransfer(from, to, amount);
  }



}