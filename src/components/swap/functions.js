import axios from "axios"


export const SwapFunction = async (walletaddress) => {

    /* Step 1 : Lookup addresses of tokens you want to swap */
    let response = await fetch('https://api.1inch.exchange/v4.0/56/tokens');
    let tokenListJSON = await response.json();
    console.log("Look Up Address=> ", tokenListJSON);

    /* Step 2 : Check for allowance of 1inch router contract to spend source asset */
    let allowanceendpoint = `https://api.1inch.exchange/v4.0/56/approve/allowance?tokenAddress=0xc3BcE47886e56316B2A5A4b2C926561AE94039A2&walletAddress=${walletaddress}`
    try {
        const response = await axios.get(allowanceendpoint);
        console.log("Allowance=>", response.data)
    } catch (err) {
        console.log("Error=>", err.message)
    }
    return;
}

export const ApproveFunction = async (walletaddress, amount) => {
    /* Step 3 : If necessary, give approval for 1inch router to spend source token */
    let approvalendpoint = `https://api.1inch.exchange/v4.0/56/approve/transaction?tokenAddress=0xc3BcE47886e56316B2A5A4b2C926561AE94039A2&amount=${amount}`
    try {
        const response = await axios.get(approvalendpoint);
        console.log("Approval=>", response.data)
    } catch (err) {
        console.log("Error=>", err.message)
    }
}


export const Tokenvalue = async (amount) => {
    /* Step 4: Monitor the best exchange route */
    let exchangerootendpoint = `https://api.1inch.exchange/v4.0/56/quote?fromTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toTokenAddress=0xc3BcE47886e56316B2A5A4b2C926561AE94039A2&amount=10`
    try {
        const response = await axios.get(exchangerootendpoint);
        console.log("Approval=>", response.data)
    } catch (err) {
        console.log("Error=>", err.message)
    }
}