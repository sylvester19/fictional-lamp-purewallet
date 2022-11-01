import * as React from 'react'
import './account.scss'
import {provider, setProvider, signer, setSigner} from '../../App';
import values from "../../values.json"
import routerAbi from '../../abi/router.json'
import tokenAbi from '../../abi/token.json'
import stakingAbi from '../../abi/staking.json';
import addresses from '../../abi/addresses.json';
import { ethers } from "ethers";


const Account = () => {

  let [balance, setBalance] = React.useState(0);
  let [price, setPrice] = React.useState(0);
  let [rebaseTime, setRebaseTime] = React.useState(0);
  let [bnbPrice, setBnbPrice] = React.useState(0);

  let [poolId, setPoolId] = React.useState(0);
  let [poolInfo, setPoolInfo] = React.useState([]);
  let [userInfo, setUserInfo] = React.useState([]);
  let [whitelistedAddresses, setWalletAddresses] = React.useState([]);
  let [amount, setAmount] = React.useState(0);
  let [stakingBalance, setStackingBalance] = React.useState(0);
  let [currentPoolSize, setCurrentPoolSize] = React.useState(0);
  let [maxPoolSize, setMaxPoolSize] = React.useState(0);
  let [timeLock, setTimeLock] = React.useState(0);
  let [claimedReward, setClaimedReward] = React.useState(0);
  let [yourReward, setYourReward] = React.useState(0);
  let [totalReward, setTotalReward] = React.useState(0);


  let _provider = React.useContext (provider);
  let _setProvider = React.useContext (setProvider);
  let _signer = React.useContext (signer);
  let _setSigner = React.useContext (setSigner);
  const decimals = 18;

  React.useEffect(() => {
    getPoolInfo();
    getUserInfo();
    try{
      async function fetchData(){
        getPrice();
        let _balance = await _getBalance(values.token);
        setBalance(_balance);
      }
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [_provider, _signer]);

  async function getPrice(){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let router = new ethers.Contract(
        values.router,
        routerAbi,
        provider_
      );
      const tokenIn = values.token;
      const tokenOut = values.wbnb;
      
      const amountIn = ethers.utils.parseUnits("1",  decimals);
      let amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
      let busd = values.busd;
      let amounts2 = await router.getAmountsOut(amounts[1], [tokenOut, busd]);
      console.log(`
          tokenIn: ${ethers.utils.formatEther(amountIn.toString())} ${tokenIn} (safeearn)
          tokenOut: ${ethers.utils.formatEther(amounts2[1].toString())} ${busd} (BUSD)
        `);
      setPrice(parseFloat(ethers.utils.formatEther(amounts2[1].toString())).toFixed(8));
    } catch (err) {
      console.log (err);
    }
  }

  async function getBnbPrice(){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let router = new ethers.Contract(
        values.router,
        routerAbi,
        provider_
      );
      const tokenIn = values.wbnb;
      
      const amountIn = ethers.utils.parseUnits("1",  decimals);
      let busd = values.busd;
      let amounts2 = await router.getAmountsOut(amountIn, [tokenIn, busd]);
      console.log(`
          tokenIn: ${ethers.utils.formatEther(amountIn.toString())} ${tokenIn} (safeearn)
          tokenOut: ${ethers.utils.formatEther(amounts2[1].toString())} ${busd} (BUSD)
        `);
      setBnbPrice(parseFloat(ethers.utils.formatEther(amounts2[1].toString())).toFixed(8));
    } catch (err) {
      console.log (err);
    }
  }

  async function _getBalance (tokenAddress, accountAddress){
    try {
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let token = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        provider_
      );
      if (!accountAddress){
        accountAddress = await _signer.getAddress();
      }
      let balance = await token.balanceOf (accountAddress);
      let decimals = await token.decimals();
      decimals = parseInt(decimals.toString());
      balance = ethers.utils.formatUnits(balance, decimals);
      console.log ("balance", balance.toString());
      return parseFloat(balance.toString()).toFixed(2);
    } catch (err){
      console.log (err, tokenAddress);
      return 0;
    }
  }

  async function getPoolInfo (){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let staking = new ethers.Contract(
        values.stakingAddress,
        stakingAbi,
        provider_
      );
      var _poolInfo = await staking.poolInfo(poolId);
      console.log ("Pool Info: ", _poolInfo);
      setPoolInfo(_poolInfo);
      let temp = ethers.utils.formatUnits(_poolInfo[2].toString(),  decimals).toString()
      console.log ("temp: ", temp, " value: ", _poolInfo[2].toString());
      setCurrentPoolSize(temp);
      temp = ethers.utils.formatUnits(_poolInfo[1].toString(),  decimals).toString()
      setMaxPoolSize(temp)
      temp = ethers.utils.formatUnits(_poolInfo[4].toString(),  decimals).toString()
      setTotalReward(temp);
    }catch(err){
      console.log(err);
    }
  }

  async function getUserInfo (){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let staking = new ethers.Contract(
        values.stakingAddress,
        stakingAbi,
        provider_
      );
      let _wallet = _signer.getAddress();      
      let _userInfo = await staking.userInfo( poolId, _wallet);
      console.log ("USER Info: ", _userInfo);
      setStackingBalance(ethers.utils.formatUnits(_userInfo[0],  decimals).toString())
      setUserInfo(_userInfo);
      let _timestamp = parseInt(_userInfo[1].toString())* 1000 ;
      let _time = new Date(_timestamp);
      if (_timestamp >0) setTimeLock(_time);
      else setTimeLock(" Not staked yet");
      let _claimedReward = ethers.utils.formatUnits( _userInfo[2],  decimals).toString();
      setClaimedReward(_claimedReward);
    }catch(err){
      console.log("User error", err);
    }
  }

  

  return (
    <div className='container'>

      {/* last block */}      
      <div className="block3">
      <div className='inner_block3'>
      <div className='dashboard-card'>
            <div className='card_title'>
            <h2>Your Balance</h2>
            </div>
            <div className="card_value card_value_acc">
             <h2>${parseFloat(balance)* (parseFloat(price).toFixed(3))}</h2>
            </div>
            <div className='card_title'>
            <h2> {balance} PURE</h2></div>
          </div>
      </div>

      <div className='inner_block3'>
        <div className='dashboard-card'>
            <div className='card_title'>
            <h2>Your Staking Balance</h2>
            </div>
            <div className="card_value card_value_acc">
             <h2>${(parseFloat(stakingBalance) * parseFloat(price)).toFixed(3)}</h2>
            </div>
            <div className='card_title'>
              <h2>{stakingBalance} PURE</h2>
            </div>
          </div>
      </div>
        <div className='inner_block3'>
        <div className='dashboard-card'>
            <div className='card_title'>
            <h2>Total Staking Balance</h2>
            </div>
            <div className="card_value card_value_acc">
             <h2>${((parseFloat(balance) + parseFloat(stakingBalance)) * (parseFloat(price))).toFixed(3)}</h2>
            </div>
            <div className='card_title'>
            <h2>Token {(parseFloat(balance) + parseFloat(stakingBalance))} PURE </h2></div>
          </div>
      </div>
      <div className='inner_block3'>
        <div className='dashboard-card'>
            <div className='card_title'>
            <h2>Claimed BNB Rewards</h2>
            </div>
            <div className="card_value card_value_acc">
             <h2>${(parseFloat(claimedReward) * parseFloat(bnbPrice)).toFixed(2)}</h2>
            </div>
            <div className='card_title'>
              <h2>{claimedReward}BNB</h2>
            </div>
          </div>
      </div>
      <div className='inner_block3'>
        <div className='dashboard-card'>
            <div className='card_title'>
            <h2>Your Total BNB Rewards</h2>
            </div>
            <div className="card_value card_value_acc">
             <h2>${((((parseFloat(stakingBalance)* parseFloat(totalReward)) / parseFloat(currentPoolSize))) * parseFloat(bnbPrice)).toFixed(2)}</h2>
            </div>
            <div className='card_title'>
              <h2>{((parseFloat(stakingBalance)* parseFloat(totalReward)) / parseFloat(currentPoolSize)).toFixed(2)}BNB</h2>
            </div>
          </div>
      </div>
      <div className='inner_block3'>
        <div className='dashboard-card'>
            <div className='card_title'>
            <h2>Total Reward Pool</h2>
            </div>
            <div className="card_value card_value_acc">
             <h2>${(parseFloat(totalReward) * parseFloat(bnbPrice)).toFixed(2)}</h2>
            </div>
            <div className='card_title'>
              <h2>{totalReward}BNB</h2>
            </div>
          </div>
      </div>

      </div>
     

    </div>
  )
}

export default Account;