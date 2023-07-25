import { useEffect, useRef} from 'react';
import LinksManagement from "./LinksManagement";
import { useMediaQuery } from "react-responsive";
import styles from './css/home.module.css'

function Home() {

    //This makes the slideup effect on navigate
    const mainContRef = useRef(null);
    useEffect(() => {
        mainContRef.current.classList.add(styles.visible)
    }, [])
    return (
        <>
            <div className={`${styles.statusBar} ${styles.statusBarRun}`}></div>
            <div className={styles.MainCont} ref={mainContRef}>
                <div className={styles.AppName}>
                    <h1>Url Pro</h1>
                    <h3>Linking made simple and permanent</h3>
                </div>
                <div className={styles.HomeCards}>
                    <div>
                        <h1>Link once, update forever</h1>
                        <h3>Sick of constantly updating links? Simplify your link management with our app's permanent link feature,
                            allowing you to create a link that never expires or gets deleted, ensuring your audience always ends up in the right place.
                        </h3>
                    </div>
                    <div>
                        <img src="/static/social.jpg" style={{ height: "300px" }}></img>
                    </div>
                </div>
                <LinksManagement />
                <div className={styles.HomeCards}>
                    <div>
                        <h1>Shorten Url's</h1>
                        <h3 style={{ maxWidth: "none" }}>Make your links memorable with URLPRO! Our powerful app lets you create custom,
                            eye-catching URLs that are easy to share and remember. Upgrade your online content today with URLPRO.
                        </h3>
                    </div>
                    <div>
                        <img src="/static/shortenurls.png" style={{ maxWidth: "100%" }}></img>
                    </div>
                </div>
                <div className={styles.HomeCards}>
                    <div>
                        <h1 >100% Free, No ads</h1>
                        <h3 >
                            Elevate your online presence - shorten your URLs for free without any annoying ads!
                            Sign up now to unlock all the amazing features.
                        </h3>
                    </div>
                    <div>
                        <img src="/static/freeNoAds.jpg" style={{ maxHeight: "300px" }}></img>
                    </div>
                </div>
                <div className={styles.HomeCards}>
                    <div>
                        <h1>Streamlined UI Design, No Distractions</h1>
                        <h3>Experience a modern and simple design with our user-friendly interface,
                            free from distractions. Get started now!</h3>
                    </div>
                    <div>
                        <img src="/static/computerSmall.jpg" style={{ height: "300px", width: "100%" }}></img>
                    </div>
                </div>
                <div className={styles.HomeCards}>
                    <div>
                        <h1>Open-Source URL Shortening Made Simple</h1>
                        <h3>Say goodbye to complex and confusing URL shortening services. With our open-source platform,
                            you can easily create and manage your links with complete transparency. Checkout <a style={{ fontWeight: "bold", color: "#0000ffb9" }} href="https://github.com/ubaidpatel595/urlpro.git">Here!</a></h3>
                    </div>
                    <img src="/static/github-mark.png"></img>
                </div>
            </div>
        </>
    )
}
export default Home