import Image from 'next/image'

export default function Ico() {
    const handle= async () => { 
      console.log("Olaboye David Tobi")
      await connectWallet()
    };
  
    return (
        <div>
		<header className="transition">
			<div className="container">
				<div className="row flex-align">
					<div className="col-lg-4 col-md-3 col-8">
						<div className="logo">
							<a href="index.html">
								payME
							</a>
						</div>
					</div>
					<div className="col-lg-8 col-md-9 col-4 text-right">
						<div className="menu-toggle">
							<span></span>
						</div>
						<div className="menu">
							<ul className="d-inline-block">
												
								<li><a href="team.html">Team</a></li>
							</ul>
							<div className="signin d-inline-block">
								<a href="#" className="btn">Connect Wallet</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>

		<section className="sub-page-banner parallax" id="banner">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="page-banner text-center wow fadeInUp">
							<h1 className="sub-banner-title">What is payME</h1>
							<button className="btn">Read White-paper</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section className="token-sele skyblue ptb-100">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="section-heading text-center pb-65 wow fadeInUp">
							<label className="sub-heading">payME Token</label>
							<h2 className="heading-title">Initial Coin Offering</h2>
							<p className="heading-des">Get whitelisted to participate in ICO</p>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-6 col-md-12 flex-align order-r-2 wow fadeInLeft">
						<div className="information-token w-100">
							<h2 className="information-token-head">Information About Tokens</h2>
							<ul>
								<li><label>Token Name</label> <span>Cryptcon</span></li>
								<li><label>Nominal Price</label> <span>1smt = 0.025USD</span></li>
								<li><label>Total Number of Token Produced</label> <span>7 BN smt</span></li>
								<li><label>Unsold Tokens</label> <span>Burn Smart Contrac</span></li>
								<li><label>Type of Token</label> <span>ERC-20</span></li>
								<li><label>Minimal transaction amount</label> <span>1 ETH/ 1 BTC/ 1 LTC</span></li>
							</ul>
							<div className="clear"></div>
						</div>
					</div>
					<div className="col-lg-6 col-md-12 order-r-1 wow fadeInRight">
						<div className="">
						   <form className='form-group'>

							 <lable>Beneficiary Address</lable>
							 <input required type="text" className='form-control'/>

							 <lable>Amount</lable>
							 <input required type="number" className='form-control'/>
							 
							 <div className='row'>
						       <button className="btn col-md-6">Approve</button>

                                <button className="btn col-md-6">Buy now</button>
							 </div>
							 


                               
						   </form>
						</div>
					</div>
				</div>
				<div className="row pt-100">
					<div className="col-md-12 wow fadeInUp">
						<div className="section-heading text-center pb-65">
							<h2 className="heading-title">Token Distribution</h2>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 wow fadeInLeft">
						<div className="token-distribut text-center">
							<h2 className="distribution-title">Token Distribution</h2>
							<div className="token-graph w-100">
								<Image src="/images/token-chart.png" width={100} height={70} alt="Token Distribution"/>
							</div>
						</div>
					</div>
					<div className="col-md-6 wow fadeInRight">
						<div className="token-distribut text-center">
							<h2 className="distribution-title">Use of Proceeds</h2>
							<div className="token-graph w-100">
								<Image src="/images/token-chart-2.png" width={100} height={70}  alt="Use of Proceeds"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<footer className="bg-pattern darkblue ptb-100">
			<div className="container">
				<div className="footer">
					<div className="row">
						<div className="col-lg-4 col-md-6">
							<div className="footer-logo pb-25">
								<a href="index.html"><Image src="/images/logo.png"  width={100} height={10} alt="Cryptcon"/></a>
							</div>
							<div className="footer-icon">
								<ul>
									<li><a href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
									<li><a href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
									<li><a href="#"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
									<li><a href="#"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-4 col-md-6">
							<div className="footer-link">
								<ul>
									<li><a href="#">What is ico</a></li>
									<li><a href="#">ICO Apps</a></li>
									<li><a href="#">Join Us</a></li>
									<li><a href="token-sale.html">Tokens</a></li>
									<li><a href="#">Whitepaper</a></li>
									<li><a href="contact.html">Contact</a></li>
									<li><a href="roadmap.html">Roadmap</a></li>
									<li><a href="team.html">Teams</a></li>
									<li><a href="faq.html">Faq</a></li>
								</ul>
							</div>
						</div>
						<div className="col-lg-4 col-md-6">
							<div className="subscribe">
								<div className="form-group">
								    <label>Subscribe to our Newsleter</label>
								    <input type="email" className="form-control" placeholder="Enter your email Address"/>
								    <input type="submit" name="submit" value="Subscribe" className="submit"/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="copyright">
					<div className="row">
						<div className="col-lg-6">
							<p>© Cryptcon all Rights Reserved. Designed By <a href="#">TemplatesCoder.com</a></p>
						</div>
						<div className="col-lg-6">
							<ul>
								<li><a href="#">Terms & Condition</a></li>
								<li><a href="#">Privacy Policy</a></li>
								<li><a href="contact.html">Contact Us</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</footer>
    </div>
    );

}