import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useContext } from "react";

// import { CrowdsaleContext } from "../context/CrowdsaleContext";
import Ico from '../components/Ico';
// const connectWallet  = React.useContext(CrowdsaleContext);

export default function Home() {
  const handle= async () => { 
    console.log("Olaboye David Tobi")
    await connectWallet()
  };


  return (
    <div>
      <Head>
        <title>payME Crowdsales</title>
        <meta name="description" content="payME Crowdsale contract" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Ico/> 


    </div>
  )
}
