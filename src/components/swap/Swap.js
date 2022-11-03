import React from 'react';
import BNBLogo from '../../images/swap/btc.svg'
import ReceiveLogo from '../../images/swap/receive.svg'
import SwitchIcon from '../../images/swap/switch.svg'
import { CheckAllowance, ApproveFunction, SwapTokens } from './functions'
import { ethers } from "ethers";
import axios from "axios"
import "./swap.scss"


const Swap = ({ useraddress, provider }) => {

  const [amount, setAmount] = React.useState("");
  const [receivingamount, setreceivingamount] = React.useState(0);
  const [swaptokentwo, SwapTokentwo] = React.useState("none");
  const [swaptokenone, SwapTokenone] = React.useState("");
  const [balancetoken, setBalanceToken] = React.useState(0);
  const [userbalance, setUserBalance] = React.useState(0);
  const [walletconnect, setWalletconnect] = React.useState(false);
  const [error, setError] = React.useState(false);

  /* For testing static address Setting here Note* */

  //const useraddress = "";
  const tokenfromaddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; //From address BNB Token
  const tokentoaddress = "0x1e8150ea46E2A7FBB795459198fBB4B35715196c"; //To address SHIH Token 

  setTimeout(function () {
    Wallet()
  }, 2000);

  React.useEffect(() => {
    Wallet()
  }, []);

  const Wallet = async () => {
    if (useraddress === "Connect") {
      setWalletconnect(false)
    } else {
      setWalletconnect(true)
      // Get bnb balance
      const balance = await provider.getBalance(useraddress);
      const balanceformat = ethers.utils.formatEther(balance);
      setUserBalance(balanceformat)
      // Get token balance
      const tokenbalance = await provider.getBalance(tokentoaddress);
      const tokenbalanceformat = ethers.utils.formatEther(tokenbalance);
      setBalanceToken(tokenbalanceformat)
      await CheckAllowance(useraddress, tokentoaddress)
    }
  }


  const Connectwallet = async () => {
    document.getElementById("walletconnect").click();
  }


  const Tokenvalue = async (props) => {
    if (amount > userbalance) {
      setError("Insufficient BNB balance")
    }
    else {
      const prices = ethers.utils.parseUnits(props.toString(), 'ether')
      let exchangerootendpoint = `https://api.1inch.exchange/v4.0/56/quote?fromTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toTokenAddress=0x111111111117dc0aa78b770fa6a738034120c302&amount=${prices.toNumber()}`
      try {
        const response = await axios.get(exchangerootendpoint);
        let toamount = response.data;
        let result = toamount?.toTokenAmount;
        setreceivingamount(result)
      } catch (exchangerootendpoint) {
        let error = exchangerootendpoint.response.data.description;
        //setError(error)
      }
    }
  }

  return (
    <div className='landing'>
      <div className='stak_box'>
        <div className='stak_heading'>
          <h2>Swapping</h2>
          <p>Convert your BNB to PURE or vice versa, Easiest and fastest way to
            convert your assets</p>
        </div>
        <div className='stak_body' id="section-one" style={{ display: `${swaptokenone}` }}>
          <div className="input1">
            <input placeholder='Enter Amount'
              onChange={(e) => { setAmount(e.target.value); Tokenvalue(e.target.value) }} className="form-field" type="text" />
            <div className='maxToken'>
              <img src={BNBLogo} alt="BNB Logo" width="100%" />
            </div>
          </div>
          <div onClick={() => { SwapTokentwo(""); SwapTokenone("none") }} className="switciconlogo">
            <img src={SwitchIcon} alt="Switch Icon" />
          </div>

          <div className="input1">
            <input placeholder='You Receive' value={receivingamount} className="form-field" type="text" />
            <div className='maxToken'>
              <img src={ReceiveLogo} alt="Recever Logo" width="100%" />
            </div>
          </div>
          {walletconnect === false ? (
            <div className="switciconlogo">
              <button type='submit' onClick={Connectwallet} className='swap-button'>Connect Wallet</button>
            </div>
          ) : walletconnect === true ? (
            <div className="switciconlogo">
              <button type='submit' onClick={() => SwapTokens(useraddress, amount, tokenfromaddress, tokentoaddress)} className='swap-button'>SWAP</button>
            </div>
          ) : ("")}
        </div>

        <div className='stak_body' id="section-two" style={{ display: `${swaptokentwo}` }}>
          <div className="input1">
            <input placeholder='Enter Amount' value={amount}
              onChange={(e) => { Tokenvalue(e.target.value) }} className="form-field" type="text" />
            <div className='maxToken'>
              <img src={ReceiveLogo} alt="Recever Logo" width="100%" />
            </div>
          </div>
          <div onClick={() => { SwapTokentwo("none"); SwapTokenone("") }} className="switciconlogo">
            <img src={SwitchIcon} alt="Switch Icon" />
          </div>
          <div className="input1">
            <input placeholder='You Receive' value={receivingamount} className="form-field" type="text" />
            <div className='maxToken'>
              <img src={BNBLogo} alt="BNB Logo" width="100%" />
            </div>
          </div>
          {walletconnect === false ? (
            <div className="switciconlogo">
              <button type='submit' onClick={Connectwallet} className='swap-button'>Connect Wallet</button>
            </div>
          ) : walletconnect === true ? (
            <div className="switciconlogo">
              <button type='submit' onClick={() => SwapTokens(useraddress, amount)} className='swap-button'>SWAP</button>
            </div>
          ) : ("")}

        </div>


        {error && (
          <div className='error-message'>
            <center>{error}</center>
          </div>
        )}

        <div className='stak_body_footer'>
          <p>Your BNB Balance <span className='stack_value'>{userbalance} BNB</span></p>
          <p>Your PURE Balance <span className='stack_value'>{balancetoken} PURE</span></p>
          <p>PURE/BNB Rate <span className='stack_value'>10000000 PURE/BNB</span></p>
        </div>
      </div>
    </div >

  )
}

export default Swap