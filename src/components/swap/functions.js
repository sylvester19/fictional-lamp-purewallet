import axios from "axios";
import { ethers } from "ethers";

export const FetchToken = async () => {
    /* Step 1 : Lookup addresses of tokens you want to swap */
    let response = await fetch('https://api.1inch.exchange/v4.0/56/tokens');
    let tokenListJSON = await response.json();
    //console.log("Look Up Address=> ", tokenListJSON);
}

export const CheckAllowance = async (walletaddress, tokentoaddress) => {
    /* Step 2 : Check for allowance of 1inch router contract to spend source asset */
    let allowanceendpoint = `https://api.1inch.exchange/v4.0/56/approve/allowance?tokenAddress=${tokentoaddress}&walletAddress=${walletaddress}`
    try {
        const response = await axios.get(allowanceendpoint);
        //console.log("Allowance=>", response.data)
    } catch (err) {
        //console.log("Error=>", err.message)
    }
    return;
}

export const ApproveFunction = async (amount, tokentoaddress) => {
    /* Step 3 : If necessary, give approval for 1inch router to spend source token */
    //const prices = ethers.utils.parseUnits(price.toString(), 'ether')
    let approvalendpoint = `https://api.1inch.exchange/v4.0/56/approve/transaction?tokenAddress=${tokentoaddress}&amount=${amount.toString()}`
    try {
        const response = await axios.get(approvalendpoint);
        //console.log("Approval=>", response.data)
    } catch (err) {
        //console.log("Error=>", err.message)
    }
}

export const SwapTokens = async (walletaddress, amount, tokenfromaddress, tokentoaddress) => {
    /* Step 5 : All Success ready use to perform swap */
    await ApproveFunction(amount, tokentoaddress)
    const prices = ethers.utils.parseUnits(amount.toString(), 'ether')
    let swapfunction = `https://api.1inch.exchange/v4.0/56/swap?fromTokenAddress=${tokenfromaddress}&toTokenAddress=${tokentoaddress}&amount=${prices.toNumber()}&fromAddress=${walletaddress}&slippage=1&gasLimit=11500000&gasPrice=2000000000`;
    try {
        const response = await axios.get(swapfunction);
        console.log("Swap Funvtion =>", response.data)
        const sendmetamask = response.data;
        try {
            const { ethereum } = window;
            await ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await ethereum.request({ method: "eth_accounts" });
            const chainId = await ethereum.request({ method: "eth_chainId" });
            sendmetamask.from = accounts[0];
            sendmetamask.gasPrice = "2000000000";
            try {
                const transaction = await window.ethereum.request({
                    method: "eth_sendTransaction",
                    params: [sendmetamask],
                });
                console.log('Response Meta=>', transaction);

            } catch (error) {
                console.log("Error=>", error)
            }
        }
        catch (error) {
            console.log("Error=>", error)
        }

    } catch (err) {
        console.log("Error=>", err.message)
    }
}



