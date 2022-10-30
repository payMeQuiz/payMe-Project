import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { crowdsaleABI, crowdsaleAddress } from "../lib/constants";

export const CrowdsaleContext = React.createContext();

let eth;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}




const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const crowdsaleContract = new ethers.Contract(
    crowdsaleAddress,
    crowdsaleABI,
    signer
  );

  return crowdsaleContract;
};

export const CrowdsaleProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      console.log("Account changed! reload page...");
    })();
  }, [currentAccount]);



  /**
   * Checks if MetaMask is installed and an account is connected
   * @param {*} metamask Injected MetaMask code from the browser
   * @returns
   */
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert("Please install metamask ");

      const accounts = await metamask.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };


  /**
   * Prompts user to connect their MetaMask wallet
   * @param {*} metamask Injected MetaMask code from the browser
   */
  const connectWallet = async (metamask = eth) => {
    try {
      console.log("Connectin metamask!");
      if (!metamask) return alert("Please install metamask ");

      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      throw new Error("No ethereum object.");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <CrowdsaleContext.Provider
      value={{
        connectWallet        
      }}
    >
      {children}
    </CrowdsaleContext.Provider>
  );
};
