import React from 'react';
import BNBLogo from '../../images/swap/btc.svg'
import ReceiveLogo from '../../images/swap/receive.svg'
import SwitchIcon from '../../images/swap/switch.svg'
import { SwapFunction, ApproveFunction } from './functions'
import { ethers } from "ethers";
import axios from "axios"
import "./swap.scss"

const Swap = ({ useraddress, provider }) => {

  const [amount, setAmount] = React.useState("");
  const [receivingamount, setreceivingamount] = React.useState(0);
  const [balancetoken, setBalanceToken] = React.useState(0);
  const [userbalance, setUserBalance] = React.useState(0);
  const [walletconnect, setWalletconnect] = React.useState(false);
  const [error, setError] = React.useState(false);

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
      let balance = await provider?.getBalance('0xC257Ee8ca00310727B02B07D0CbB11C5672e172a');
      let userbalance = await provider?.getBalance('0x93686b29Eeacd6a28577dd95c0c9967Aa541ed83');
      setBalanceToken(ethers.utils.formatEther(balance)); setUserBalance(ethers.utils.formatEther(userbalance))
      await SwapFunction(useraddress)
    }
  }



  const Connectwallet = async () => {
    document.getElementById("walletconnect").click();
  }


  const Tokenvalue = async (amount) => {
    /* Step 4: Monitor the best exchange route */
    let exchangerootendpoint = `https://api.1inch.exchange/v4.0/56/quote?fromTokenAddress=0x242a1fF6eE06f2131B7924Cacb74c7F9E3a5edc9&toTokenAddress=0xc3BcE47886e56316B2A5A4b2C926561AE94039A2&amount=${amount}`
    try {
      const response = await axios.get(exchangerootendpoint);
      console.log("Approval=>", response.data)
    } catch (exchangerootendpoint) {
      let error = exchangerootendpoint.response.data.description;
      setError(error)
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
        <div className='stak_body'>
          <div className="input1">
            <input placeholder='Enter Amount' value={amount}
              onChange={(e) => { setAmount(e.target.value); Tokenvalue(amount) }} className="form-field" type="text" />
            <div className='maxToken'>
              <img src={BNBLogo} alt="BNB Logo" width="100%" />
            </div>
          </div>
          <div className="switciconlogo">
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
              <button type='submit' onClick={() => ApproveFunction(useraddress, amount)} className='swap-button'>SWAP</button>
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
    </div>

  )
}

export default Swap