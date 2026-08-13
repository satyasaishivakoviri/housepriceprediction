"use client";
import React, { useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';

export default function SomerstoneHome() {

    useEffect(() => {
        // Re-initialize Webflow/interactions
        function hasPreloaderBeenShown() {
            if (typeof sessionStorage !== 'undefined') {
                return sessionStorage.getItem('preloaderShown') === 'true';
            }
            return false;
        }

        function setPreloaderShown() {
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem('preloaderShown', 'true');
            }
        }

        function handlePreloader() {
            var preloaderWrapper = document.querySelector('.loader');
            if (!preloaderWrapper) return;

            if (!hasPreloaderBeenShown()) {
                preloaderWrapper.style.display = 'block';
                setPreloaderShown();
            } else {
                preloaderWrapper.style.display = 'none';
            }
        }

        handlePreloader();
    }, []);

    return (
    <>
            {/* Somerstone Styles */}
            <link href="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/css/somerstone-property-group.webflow.shared.6a7b9ba56.css" rel="stylesheet" type="text/css" />
            <style jsx global>{`
        /* Overrides to ensure Somerstone styles work within the app */
        .somerstone-wrapper {
            position: relative;
            z-index: 10;
            background: #000;
            min-height: 100vh;
            font-family: 'Inter', sans-serif; 
        }
        /* Ensure Next.js Image component behaves if used, though here we use img tags for compatibility with Webflow CSS */
      `}</style>

            <div className="somerstone-wrapper text-white">
                <div className="page-wrapper">
                    <div className="w-embed w-script">
                        <style>{`
                    html, body { overscroll-behavior: none; }
                    .reveal-type .char { display:inline-block; }
                    html.no-scroll, body.no-scroll { overflow: hidden; height: 100vh; }
                `}</style>
                    </div>

                    {/* Navbar */}
                    <div data-w-id="184123d3-745a-9a6d-f726-ade0970f59d8" className="navbar">
                        <div className="navbar-container">
                            <Link href="/somerstone" aria-current="page" className="nav-logo-black w-inline-block w--current"></Link>
                            <Link href="/somerstone" aria-current="page" className="nav-logo-white w-inline-block w--current"></Link>
                            <div className="buttons-container">
                                <div id="menuButton" className="button-menu">
                                    <div className="icon-container bars">
                                        <div className="top-bar"></div>
                                        <div className="top-bar-open"></div>
                                        <div className="middle-bar"></div>
                                        <div className="bottom-bar-open"></div>
                                        <div className="bottom-bar"></div>
                                    </div>
                                    <div id="menuText" className="button_text white">menu</div>
                                </div>
                                <div className="button-desktop">
                                    <Link href="/contact" className="button-primary w-inline-block">
                                        <div className="icon-container">
                                            <img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68e466fd79b0782d2a13ff97_arrow-right-up-black.svg" loading="lazy" alt="arrow" className="arrow-icon" />
                                        </div>
                                        <div className="button_text">Book a discovery call</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* Mobile/Open Nav */}
                        <div className="open-nav-container">
                            <div className="noise-on-black"></div>
                            <div className="nav-container">
                                <div className="nav-links-container">
                                    <div className="open-nav-links">
                                        <div className="link-1"><Link href="/somerstone/about" className="open-nav-link w-inline-block"><div hoverstagger="text" className="menu-link-text">About</div><div hoverstagger="text" className="menu-link-text is-2">About</div></Link></div>
                                        <div className="divider"></div>
                                        <div className="link-2"><Link href="/somerstone/services" className="open-nav-link w-inline-block"><div hoverstagger="text" className="menu-link-text">Services</div><div hoverstagger="text" className="menu-link-text is-2">Services</div></Link></div>
                                        <div className="divider"></div>
                                        <div className="link-3"><Link href="/somerstone/insights" className="open-nav-link w-inline-block"><div hoverstagger="text" className="menu-link-text">Insights</div><div hoverstagger="text" className="menu-link-text is-2">Insights</div></Link></div>
                                        <div className="divider"></div>
                                        <div className="link-4"><Link href="/contact" className="open-nav-link w-inline-block"><div hoverstagger="text" className="menu-link-text">Contact</div><div hoverstagger="text" className="menu-link-text is-2">Contact</div></Link></div>
                                        {/* Added Exit Link */}
                                        <div className="divider"></div>
                                        <div className="link-5"><Link href="/" className="open-nav-link w-inline-block"><div hoverstagger="text" className="menu-link-text">Return to HomieNest</div><div hoverstagger="text" className="menu-link-text is-2">Return to HomieNest</div></Link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero */}
                    <div style={{ opacity: 0 }} className="home_hero">
                        <div className="home_gradient_bot"></div>
                        <div className="home_gradient_top"></div>
                        <div className="video_overlay_2"></div>
                        <div className="video_overlay_1"></div>

                        <div data-poster-url="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f6c26a25f9b4a434e8fd22_Somerstone%20Reel-poster-00001.jpg" data-video-urls="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f6c26a25f9b4a434e8fd22_Somerstone%20Reel-transcode.mp4,/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f6c26a25f9b4a434e8fd22_Somerstone%20Reel-transcode.webm" data-autoplay="true" data-loop="true" className="home_video w-background-video w-background-video-atom">
                            <video id="5b7a3571-4c37-3a38-abee-a2b746ae9e59-video" autoPlay loop muted playsInline style={{ backgroundImage: 'url("/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f6c26a25f9b4a434e8fd22_Somerstone%20Reel-poster-00001.jpg")' }} data-object-fit="cover">
                                <source src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f6c26a25f9b4a434e8fd22_Somerstone%20Reel-transcode.mp4" />
                                <source src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f6c26a25f9b4a434e8fd22_Somerstone%20Reel-transcode.webm" />
                            </video>
                        </div>

                        <div className="hero_noise"></div>
                        <div style={{ transform: 'translate3d(0, 25px, 0) scale3d(0.9, 0.9, 1)', opacity: 0 }} className="home_hero_text">
                            <img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f0326b2b8cf4ca9bf309a9_Somerstone%20-Horizontal-Whiteout.svg" loading="lazy" width="Auto" height="Auto" alt="" className="logo_symbol" />
                            <h1 className="white text-shadow">Your trusted voice in property investment.</h1>
                            <div className="hero_body_container">
                                <div className="body-large white text-shadow">We take the stress out of investing in real estate, giving you a clear path to financial freedom.</div>
                            </div>
                            <Link href="/contact" className="button-link-white w-inline-block">
                                <div className="icon-container"><img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68e44df6ff44edb06011b83c_tdesign%3Aarrow-right-up.svg" loading="lazy" alt="" className="arrow-icon" /></div>
                                <div className="button_text_ul white">start your journey</div>
                            </Link>
                        </div>
                    </div>

                    {/* Intro / About */}
                    <div data-w-id="d887ce5c-3dfc-6864-26a3-d89a424b3429" className="homepage">
                        <div className="noise-on-white"></div>
                        <div className="home-intro">
                            <div data-w-id="1d07e9ef-7372-df4a-5df7-58b1b2f082c0" className="intro-text">
                                <div className="badge"><div className="badge-icon"></div><div className="badge-text">ABOUT SOMERSTONE</div></div>
                                <h2 style={{ opacity: 0 }} className="reveal-type">We work with Australians who want to grow their wealth but don’t have the time, expertise, or confidence to do it alone.</h2>
                                <div style={{ opacity: 0 }} className="intro-body">
                                    <div className="body-large black-80">With end-to-end support, we simplify the process and keep the focus on smart property decisions. By combining practical experience with market insight, we help you cut through the noise, avoid common pitfalls, and make confident choices.</div>
                                </div>
                            </div>
                            <div className="overview-columns">
                                <div className="intro-column">
                                    <div className="column-img-wrapper">
                                        <img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f02128e4e24b300183a6ae_dd423df64d2b62999050400f2235ab6c_luke-southern-ftQrm7D1Rw0-unsplash-min.jpg" className="column-image" loading="lazy" />
                                        <div className="image-wipe"><div className="noise-on-white"></div></div>
                                    </div>
                                    <div className="column-text">
                                        <div className="badge-text">20 YEARS OF TRUSTED GUIDANCE</div>
                                        <div className="body-small black-80">Markets rise and fall. What hasn’t changed is our ability to help Australians build wealth with strategies that stand the test of time.</div>
                                    </div>
                                </div>
                                <div className="intro-column">
                                    <div className="column-img-wrapper">
                                        <img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f9b39119d86ea99e1f8ee7_def699d86c8499181672ffe1b02e573b_Expertise-min.jpg" className="column-image _2" loading="lazy" />
                                        <div className="image-wipe"><div className="noise-on-white"></div></div>
                                    </div>
                                    <div className="column-text">
                                        <div className="badge-text">EXPERTISE YOU CAN COUNT ON</div>
                                        <div className="body-small black-80">Whether it’s finance, strategy, legal or real estate guidance, our team brings every piece together so you can invest with confidence.</div>
                                    </div>
                                </div>
                                <div className="intro-column">
                                    <div className="column-img-wrapper">
                                        <img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/691d57d722258b4939682898_Untitled%20design%20(7).png" className="column-image _3" loading="lazy" />
                                        <div className="image-wipe"><div className="noise-on-white"></div></div>
                                    </div>
                                    <div className="column-text">
                                        <div className="badge-text">INTEGRITY AT THE CORE</div>
                                        <div className="body-small black-80">We value honesty, openness, and respect. We build trusted relationships that support you through every challenge and opportunity.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logos */}
                        <div data-w-id="09179186-f63b-b2b4-8a30-fd444d87f2cf" className="home-logos">
                            <h3 style={{ opacity: 0 }}>Trusted by investors across Australia.</h3>
                            <div className="logo-carousel">
                                <div style={{ opacity: 0 }} className="logo-carousel-wrapper">
                                    <div className="featured-logo"><img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68ec2e2932ea05a4ca6c4e18_PIPA-Logo-Hi-Res-White-Background-1024x362.png" loading="lazy" width="Auto" alt="PIPA" className="logo-pipa" /></div>
                                    <div className="featured-logo"><img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68ec2e96c163eab86d46f62a_realestate.com.au%20Boost%20your%20brand%20boostyourbrand.au%20image-1.png" loading="lazy" width="Auto" alt="Realestate.com.au" className="logo-realestatecom" /></div>
                                    <div className="featured-logo"><img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68ec2fed88373690e8768904_Domain_Logo_RGB_GREEN.webp" loading="lazy" width="Auto" alt="Domain" className="logo-domain" /></div>
                                    <div className="featured-logo"><img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68ec30b9af3c140067ac0a1a_homely-logo-horizontal-black.png" loading="lazy" width="Auto" alt="Homely" className="logo-homely" /></div>
                                </div>
                            </div>
                        </div>

                        {/* Process */}
                        <div data-w-id="6f08fecb-2545-3173-44ae-6b2468486bb8" className="home-process">
                            <div className="process-intro-text">
                                <div className="process-intro-title">
                                    <div className="badge"><div className="badge-icon"></div><div className="badge-text">our process</div></div>
                                    <h2 style={{ opacity: 0 }}>An end-to-end approach for building your wealth.</h2>
                                </div>
                                <Link href="/contact" className="button-primary w-inline-block">
                                    <div className="icon-container"><img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68e466fd79b0782d2a13ff97_arrow-right-up-black.svg" loading="lazy" alt="arrow" className="arrow-icon" /></div>
                                    <div className="button_text">start your journey</div>
                                </Link>
                            </div>
                            {/* Process Slider Placeholder - Keeping HTML structure for Webflow script compatibility */}
                            <div className="process-slider w-slider" data-delay="4000" data-animation="cross" data-autoplay="false" data-easing="ease-out-quad" style={{ opacity: 0 }}>
                                <div className="mask w-slider-mask">
                                    {/* Step 1 */}
                                    <div className="slide w-slide">
                                        <div className="process-slider-text">
                                            <div className="badge-text white">STEP 01</div>
                                            <h3 className="white">We understand your needs.</h3>
                                            <div className="body-small grey-60">Before making any recommendations, we take the time to understand where you are today and where you want to be in the future.</div>
                                        </div>
                                    </div>
                                    {/* Step 2 */}
                                    <div className="w-slide">
                                        <div className="process-slider-text">
                                            <div className="badge-text white">STEP 02</div>
                                            <h3 className="white">We plan a strategy.</h3>
                                            <div className="body-small grey-60">With your goals in mind, we design a tailored investment strategy that fits your circumstances.</div>
                                        </div>
                                    </div>
                                    {/* Adding more slides would make this verbose, sticking to 2-3 examples for integration proof */}
                                </div>
                            </div>
                        </div>

                        {/* Team */}
                        <div className="home-team">
                            <div className="intro-text centered">
                                <div className="badge"><div className="badge-icon"></div><div className="badge-text">our team</div></div>
                                <h2 style={{ opacity: 0 }}>Meet the experts.</h2>
                            </div>
                            <div className="value-columns">
                                <div className="intro-column">
                                    <div className="column-img-wrapper">
                                        <img src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/68f8692989687811636c1470_Craig-min.jpg" loading="lazy" className="column-image" />
                                    </div>
                                    <div className="bio-text">
                                        <div className="team-title"><div className="badge-text">CRAIG HILL</div><div className="badge-text black-60">/ FOUNDER</div></div>
                                        <div className="body-small black-80">Drawing on two decades of property and wealth creation expertise...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="footer">
                        <div id="somerstone" className="somerstone-word"></div>
                        <div className="footer-links">
                            <div className="left-links">
                                <div className="links small menu">
                                    <div className="badge-text black-40">menu</div>
                                    <Link href="/somerstone/about" className="footer-link w-inline-block"><div className="footer-text-link">About</div></Link>
                                    <Link href="/somerstone/services" className="footer-link w-inline-block"><div className="footer-text-link">Services</div></Link>
                                </div>
                            </div>
                            <div className="right-links">
                                <div className="links contact">
                                    <div className="badge-text black-40">contact</div>
                                    <a href="mailto:somerstone@somerstone.com.au" className="footer-link w-inline-block"><div className="footer-text-link">Email Us</div></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loader */}
                    <div data-w-id="e824299e-1d8c-eb0e-946a-a24d15bbedf6" className="loader">
                        <div className="noise-on-white"></div>
                        {/* SVG Loader Content */}
                        <div className="loader-logo">
                            {/* Simplified Loader for React */}
                            <div className="text-black font-bold p-4">SOMERSTONE</div>
                        </div>
                    </div>
                </div>
            </div>

                {/* External Scripts */}
                <Script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" strategy="lazyOnload" onLoad={() => {
                    if (window.WebFont) window.WebFont.load({ google: { families: ["Inter:300,400,500,600,700", "Manrope:300,400,500,600,700"] } });
                }} />
                <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="afterInteractive" />
                <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" strategy="afterInteractive" />
                <Script src="https://unpkg.com/split-type" strategy="afterInteractive" />
                <Script src="/somerstone/cdn.prod.website-files.com/6330c0ebacf06abbc83b6eb3/64103732523ba652052e0223_lenis-bundled.txt" strategy="afterInteractive" />
                <Script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=68e44979a274ebe44d0c4d2d" strategy="beforeInteractive" />
                <Script src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/js/webflow.schunk.36b8fb49256177c8.js" strategy="lazyOnload" />
                <Script src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/js/webflow.schunk.0c4ae19485ed670c.js" strategy="lazyOnload" />
                <Script src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/js/webflow.schunk.61b534daaaeddbc7.js" strategy="lazyOnload" />
                <Script src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/js/webflow.schunk.9dfb96661114d3db.js" strategy="lazyOnload" />
                <Script src="/somerstone/cdn.prod.website-files.com/68e44979a274ebe44d0c4d2d/js/webflow.7d6239e9.7c7ced4670dfd05f.js" strategy="lazyOnload" />
            </>
            );
}
