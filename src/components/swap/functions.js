import axios from "axios"

export const FetchToken = async (walletaddress) => { }

export const SwapFunction = async (walletaddress) => {
    /* Step 1 : Lookup addresses of tokens you want to swap */
    let response = await fetch('https://api.1inch.exchange/v4.0/56/tokens');
    let tokenListJSON = await response.json();
    //console.log("Look Up Address=> ", tokenListJSON);
    /* Step 2 : Check for allowance of 1inch router contract to spend source asset */
    let allowanceendpoint = `https://api.1inch.exchange/v4.0/56/approve/allowance?tokenAddress=0xc3BcE47886e56316B2A5A4b2C926561AE94039A2&walletAddress=${walletaddress}`
    try {
        const response = await axios.get(allowanceendpoint);
        //console.log("Allowance=>", response.data)
    } catch (err) {
        //console.log("Error=>", err.message)
    }
    return;
}

export const ApproveFunction = async (walletaddress, amount) => {
    /* Step 3 : If necessary, give approval for 1inch router to spend source token */
    let approvalendpoint = `https://api.1inch.exchange/v4.0/56/approve/transaction?tokenAddress=0xc3BcE47886e56316B2A5A4b2C926561AE94039A2&amount=${amount}`
    try {
        const response = await axios.get(approvalendpoint);
        //console.log("Approval=>", response.data)
    } catch (err) {
        //console.log("Error=>", err.message)
    }
    /* Step 5 : All Success ready use to perform swap */
    let swapfunction = `https://api.1inch.exchange/v4.0/56/swap?fromTokenAddress=0x242a1fF6eE06f2131B7924Cacb74c7F9E3a5edc9&toTokenAddress=0xc3BcE47886e56316B2A5A4b2C926561AE94039A2&amount=${amount}&fromAddress=${walletaddress}&slippage=1`;
    try {
        const response = await axios.get(swapfunction);
       // console.log("Approval=>", response.data)
    } catch (err) {
        //console.log("Error=>", err.message)
    }
}

