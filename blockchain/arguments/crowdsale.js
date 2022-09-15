// IERC20 _BUSDT,
// address _vestingAddress,
// uint256 rate,    // rate in PayME
// address payable wallet,
// IERC20 _token,
// uint256 _cap,
// uint256 _openingTime,
// uint256 _closingTime,
// uint256 _TGETime,
// uint256 _cliff,
// uint256 _duration

crowdsaleArgs = [
    "0x24a7B89690720cDD698C91EF1747fDa6AB241c6b",
    "0x2260DdB4bf1129A1468C23de5A000aA09367895e", //_vestingAddress
    "2000", //rate
    "0x731421dEAF8bcD6396F573e9412F68e7A258dca8", //wallet
    "0xf82D63340Ce5CaF0dba8598E6A3ab2f58b944cC2",  //_token
    "1000000000000000000000000000",  //_cap
    "1661934604", //_openingTime
    "1661985004", //_closingTime
    "604800", //_TGETime
    "1661511644" //_duration
];

module.exports = crowdsaleArgs;

//module.exports.crowdsaleArgs = crowdsaleArgs;

