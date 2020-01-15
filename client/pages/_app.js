import React from 'react';
import App from 'next/app';
import initializeStore from '../store'
import {Provider} from 'mobx-react'
import Router from 'next/router';
import Layout from '../components/Layout'
import nookies from 'nookies'
import {getBoardSet, getUserInfo} from "../api";

const isServer = typeof window === 'undefined';

Router.events.on('routeChangeComplete', () => {
    if (process.env.NODE_ENV !== 'production') {
        const els = document.querySelectorAll('link[href*="/_next/static/css/styles.chunk.css"]');
        const timestamp = new Date().valueOf();
        els[0].href = '/_next/static/css/styles.chunk.css?v=' + timestamp;
        els[0].setAttribute('rel', 'stylesheet')
    }
});

class MyApp extends App {
    static async getInitialProps({Component, ctx}) {
        const cookies = nookies.get(ctx)
        let pageProps = {isServer};
        //初始化mobx状态
        const  boardSetting=await getBoardSet(cookies);
        const  currentUser=await getUserInfo(cookies);
        const mobxStore = initializeStore({boardSetting,currentUser});
        pageProps = Object.assign(pageProps, isServer);
        if (Component.getInitialProps) {
            const compprops = await Component.getInitialProps({ctx});
            pageProps = Object.assign(pageProps, compprops);
        }
        return {pageProps, mobxStore};
    }

     constructor(props) {
        super(props);
        if (isServer) {
            this.mobxStore = props.mobxStore
        } else {
            this.mobxStore = initializeStore(props.mobxStore);
        }


    }

    render() {

        const {Component, pageProps} = this.props
        return (
            <Provider {...this.mobxStore}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        )
    }
}

export default MyApp
