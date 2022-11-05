import axios from "axios";
import { ethers } from "ethers";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import toast from 'react-hot-toast';



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

export const ApproveFunction = async (walletaddress, amount, tokenfromaddress, tokentoaddress, wallet) => {
    /* Step 3 : If necessary, give approval for 1inch router to spend source token */
    let loading = toast.loading("Please Wait until the contract get's approved")
    const prices = ethers.utils.parseUnits(amount.toString(), 'ether')
    let approvalendpoint = `https://api.1inch.exchange/v4.0/56/approve/transaction?tokenAddress=${tokentoaddress}&amount=${prices.toNumber()}`
    try {
        const response = await axios.get(approvalendpoint);
        console.log("Response=>", response)
        /* If the User connction wallet is metamask the function will execute */
        if (wallet === "wallet") {
            try {
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
                        toast.success("Transaction Approved, Please Wait...")
                        SwapTokens(walletaddress, amount, tokenfromaddress, tokentoaddress, wallet)
                    } catch (error) {
                        toast.dismiss(loading)
                        console.log("Error=>", error)
                    }
                }
                catch (error) {
                    toast.dismiss(loading)
                    console.log("Error=>", error)
                }

            } catch (err) {
                toast.dismiss(loading)
                console.log("Error=>", err.message)
            }
        } else {
            /*If the wallet not equal to metamask it goes to wallet connect function */
            const sendmetamask = response.data;
            const connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org", // Required
                qrcodeModal: QRCodeModal,
            });
            if (!connector.connected) {
                // create new session
                connector.createSession();
                connector.on("connect", (error, payload) => {
                    if (error) {
                        throw error;
                    }
                    // Get provided accounts and chainId
                    const { accounts, chainId } = payload.params[0];
                    const account = accounts[0]
                    console.log(account);
                    alert("Please Click again to Initiate the Transaction...")
                });
            }
            else {
                sendmetamask.from = walletaddress;
                connector.sendTransaction(sendmetamask).then((swapresult) => {
                    console.log('Swap Result', swapresult);
                })
                    .catch((error) => {
                        toast.dismiss(loading)
                        console.error('sell error', error);
                    });
            }
        }
        toast.success("Transaction Approved, Please Wait...")
        toast.dismiss(loading)
    } catch (err) {
        toast.dismiss(loading)
        //console.log("Error=>", err.message)
    }
}

export const SwapTokens = async (walletaddress, amount, tokenfromaddress, tokentoaddress, wallet) => {
    if (tokenfromaddress === "0x1e8150ea46E2A7FBB795459198fBB4B35715196c") {
        ApproveFunction(walletaddress, amount, tokenfromaddress, tokentoaddress, wallet)
    } else {
        /* Step 5 : All Success ready use to perform swap */
        const prices = ethers.utils.parseUnits(amount.toString(), 'ether')
        let swapfunction = `https://api.1inch.exchange/v4.0/56/swap?fromTokenAddress=${tokenfromaddress}&toTokenAddress=${tokentoaddress}&amount=${prices.toNumber()}&fromAddress=${walletaddress}&slippage=1&gasLimit=11500000&gasPrice=20000`;
        let response = await axios.get(swapfunction);
        console.log("Swap Funvtion =>", response.data)
        /* If the User connction wallet is metamask the function will execute */
        if (wallet === "wallet") {
            try {
                const sendmetamask = response.data;
                try {
                    let loading = toast.loading("Please Wait until the contract get's approved")
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
                        toast.dismiss(loading)
                        toast.success("Swap Transaction Success....");
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
        } else {
            /*If the wallet not equal to metamask it goes to wallet connect function */
            let loading = toast.loading("Please Wait until the contract get's approved")
            const sendmetamask = response.data;
            const connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org", // Required
                qrcodeModal: QRCodeModal,
            });
            if (!connector.connected) {
                // create new session
                connector.createSession();
                connector.on("connect", (error, payload) => {
                    if (error) {
                        throw error;
                    }
                    // Get provided accounts and chainId
                    const { accounts, chainId } = payload.params[0];
                    const account = accounts[0]
                    console.log(account);
                    alert("Please Click again to Initiate the Transaction...")
                });
            }
            else {
                sendmetamask.from = walletaddress;
                connector.sendTransaction(sendmetamask).then((swapresult) => {
                    console.log('Swap Result', swapresult);
                })
                    .catch((error) => {
                        console.error('sell error', error);
                    });
            }
            toast.success("Swap Transaction Success....");
            toast.dismiss(loading)
        }
    }
}




