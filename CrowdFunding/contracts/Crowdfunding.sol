pragma solidity ^0.8.11;
library SafeMath {
  /**
   * SafeMath mul function
   * @dev function for safe multiply
   **/
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }
  
  /**
   * SafeMath div funciotn
   * @dev function for safe devide
   **/
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a / b;
    return c;
  }
  
  /**
   * SafeMath sub function
   * @dev function for safe subtraction
   **/
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }
  
  /**
   * SafeMath add fuction 
   * @dev function for safe addition
   **/
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}
contract Crowdfunding
{
    using SafeMath for uint;
    mapping(address => uint)Payments;
    bool targetReached;
    bool timeReached;
    uint private target;
    uint private stop;
    uint private BalanceRecieved;
    address private owner;
    event setTime(address indexed _from,uint _value);
    event setTarget(address indexed _from,uint _value);
    event changeOwner(address indexed _from,address indexed _to);
    event refund(address indexed _from,uint _value);
    event funding(address indexed _from,uint _value);
    event payment(address indexed _to,uint _value);

    constructor(){
        owner = msg.sender;
    }

    function SetTarget(uint _target)external returns(bool success){
        target = _target;
         require(target != 0,"Target amount cannot be zero");
         require(timeReached == false,"Time already reached");
          require(targetReached == false,"Target already reached");
          emit setTarget(msg.sender, _target);
          return true;
          
    }
    function SetTime(uint _stop)external returns(bool success){
        require(_stop > block.timestamp,"Timer is less");
        stop = _stop;
        emit setTime(msg.sender,_stop);
        return true;
    }
    
    function ShowTarget()external view returns(uint){
        return target;
    }

    function ShowStop()external view returns(uint){
        return stop;
    }

    function ShowStart()external view returns(uint){
     return block.timestamp;
    }
   

    function ChangeOwner(address _owner)external returns(bool success){
        require(msg.sender == owner,"You are not the Owner");
        owner = _owner;
        emit changeOwner(msg.sender, _owner);
        return true;
    }

    function ShowOwner()external view returns(address){
        return owner;
    }
    function IsTimeUp()external view returns(bool success){
       
      return timeReached;
        
    }


    function Funding(address payable beneficiary)external payable returns (bool success){
        Payments[msg.sender] = Payments[msg.sender].add(msg.value);
        BalanceRecieved = BalanceRecieved.add(msg.value);
        require(stop > block.timestamp,"Time reached");
        require(timeReached == false);
        require(targetReached == false , "Target Reached");
        require(address(this).balance <= target,"Target is reached");
        emit funding(msg.sender,msg.value);

       if(address(this).balance >= target){
           targetReached = true;
           beneficiary.transfer(address(this).balance);  
           target = 0;
           emit payment(beneficiary,msg.value);
       }
              
       return true;
       }

       function Refund()external payable returns(bool success){
           timeReached = true;
            require(block.timestamp > stop,"Time not reached");
            require(block.timestamp > stop,"Funding ungoing");
            uint amount = Payments[msg.sender];
         payable(msg.sender).transfer(amount);
         Payments[msg.sender] = 0;
         emit refund(msg.sender,msg.value);
          return true;
        }
       


    function Balance()external view returns(uint){
        return address(this).balance;
    }
  

}