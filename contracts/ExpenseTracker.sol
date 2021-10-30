pragma solidity >=0.4.22 <0.9.0;

contract ExpenseTracker {
    mapping(address => uint256) private _balances;
    event Transfer(address indexed from, address indexed to, uint256 value);

    uint256  _Balance;
    address private owner;
  

    
    constructor() public {
        owner= msg.sender;
        _Balance=100000;
        _balances[owner]=_Balance;
        emit Transfer(address(this),owner,_Balance);
    }
    
    function Add_Income(uint256 qty) public {
        _Balance += qty;
        
    }
    function Add_Expense (uint256 qunty) public {
        _Balance -= qunty;        
    }
    function Total_Balance() view public returns (uint256){
    return _Balance;
    }

}