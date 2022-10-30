import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useContext } from "react";

import { CrowdsaleContext } from "../context/CrowdsaleContext";
const connectWallet  = React.useContext(CrowdsaleContext);

export default function Home() {
  const handle= async () => { 
    console.log("Olaboye David Tobi")
    await connectWallet()
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>payME Crowdsales</title>
        <meta name="description" content="payME Crowdsale contract" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to payME crowdsale page
        </h1>

        <p className={styles.description}>
          Intial coin offering
          <code className={styles.code}>ico</code>
        </p>

           <button
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd] "
              type="button"
              onClick={() => handle()}
           >Connect wallet</button>
      </main>

      <footer className={styles.footer}>
       Built with love of web3
      </footer>
    </div>
  )
}
