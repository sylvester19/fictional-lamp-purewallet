import React from 'react';
import BNBLogo from '../../images/swap/btc.svg'
import ReceiveLogo from '../../images/swap/receive.svg'
import SwitchIcon from '../../images/swap/switch.svg'
import { CheckAllowance, ApproveFunction, SwapTokens } from './functions'
import { ethers } from "ethers";
import "./swap.scss"
const ERC20_ABI = [{ 'constant': true, 'inputs': [{ 'name': '_owner', 'type': 'address' }], 'name': 'balanceOf', 'outputs': [{ 'name': 'balance', 'type': 'uint256' }], 'payable': false, 'type': 'function' }];
const SINGLE_CALL_BALANCES_ADDRESS = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39'

const Swap = ({ useraddress, provider, wallet }) => {

  const [amount, setAmount] = React.useState("");
  const [receivingamount, setreceivingamount] = React.useState(0);
  const [swaptokentwo, SwapTokentwo] = React.useState("none");
  const [swaptokenone, SwapTokenone] = React.useState("");
  const [balancetoken, setBalanceToken] = React.useState(0);
  const [userbalance, setUserBalance] = React.useState(0);
  const [tokenfromaddress, settokenfromaddress] = React.useState("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
  const [tokentoaddress, settokentoaddress] = React.useState("0x1e8150ea46E2A7FBB795459198fBB4B35715196c");
  const [walletconnect, setWalletconnect] = React.useState(false);
  const [error, setError] = React.useState(false);


  setTimeout(function () {
    Wallet()
  }, 2000);

  React.useEffect(() => {
    Wallet()
    let fetchbalance = new ethers.Contract(
      SINGLE_CALL_BALANCES_ADDRESS,
      ERC20_ABI,
      provider
    );
    console.log("Fetch Baa=>", fetchbalance)
  }, []);

  const Wallet = async () => {
    if (useraddress === "Connect") {
      setWalletconnect(false)
    } else {
      setWalletconnect(true);
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
    // if (amount > userbalance) {
    //   setError("Insufficient BNB balance")
    // }
    // else {
    //const prices = ethers.utils.parseUnits(props.toString(), 'ether')
    try {
      const url = `${process.env.REACT_APP_CORUS_URL}` + `${process.env.REACT_APP_COINMARKET_ENDPOINT}?amount=1&symbol=SHIH`;
      fetch(url, {
        method: "GET",
        withCredentials: true,
        headers: {
          "X-CMC_PRO_API_KEY": "79da1075-a7f3-495e-8285-774af970f7bc",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }
      })
        .then(resp => resp.json())
        .then(function (data) {
          let onetoken = data.data[0].quote.USD.price;
          let total = props / onetoken;
          setreceivingamount(total)
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (exchangerootendpoint) {
      let error = exchangerootendpoint.response.data.description;
      //setError(error)
    }
    // }
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
          <div onClick={() => { setreceivingamount(""); setAmount(""); SwapTokentwo(""); SwapTokenone("none"); settokenfromaddress("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"); settokentoaddress("0x1e8150ea46E2A7FBB795459198fBB4B35715196c") }} className="switciconlogo">
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
          <div onClick={() => { setreceivingamount(""); setAmount(""); SwapTokentwo("none"); SwapTokenone(""); settokenfromaddress("0x1e8150ea46E2A7FBB795459198fBB4B35715196c"); settokentoaddress("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") }} className="switciconlogo">
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
              <button type='submit' onClick={() => SwapTokens(useraddress, amount, wallet)} className='swap-button'>SWAP</button>
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