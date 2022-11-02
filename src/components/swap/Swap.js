import React from 'react';
import BNBLogo from '../../images/swap/btc.svg'
import ReceiveLogo from '../../images/swap/receive.svg'
import SwitchIcon from '../../images/swap/switch.svg'
import { SwapFunction, ApproveFunction, Tokenvalue } from './functions'
import "./swap.scss"

const Swap = (props) => {
  const walletaddress = props.useraddress;
  const [amount, setAmount] = React.useState("");


  React.useEffect((walletaddress) => {
    if (props?.chainId === 56) {
      SwapFunction(walletaddress)
    } else {
      if (props.useraddress === "Connect") {
        alert("Please Connect Wallet");
        return false;
      } else {
        alert("Please Switch to BSC to continue");
        return false;
      }

    }
  }, []);



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
            <input placeholder='You Receive' className="form-field" type="text" />
            <div className='maxToken'>
              <img src={ReceiveLogo} alt="Recever Logo" width="100%" />
            </div>
          </div>
          <div className="switciconlogo">
            <button type='submit' onClick={() => ApproveFunction(walletaddress, amount)} className='swap-button'>SWAP</button>
          </div>
        </div>
        <div className='stak_body_footer'>
          <p>Your BNB Balance <span className='stack_value'>2.09 BNB</span></p>
          <p>Your PURE Balance <span className='stack_value'>23123123 PURE</span></p>
          <p>PURE/BNB Rate <span className='stack_value'>10000000 PURE/BNB</span></p>
        </div>
      </div>
    </div>

  )
}

export default Swap