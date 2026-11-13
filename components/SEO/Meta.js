import React from 'react'
import Head from 'next/head';

export default function Meta() {
    return (
        <Head>
           /* Primary Meta Tags */
            <title>Helmi Lakhder</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Helmi Lakhder" />
            <meta name="description"
                content="Helmi Lakhder's Personal Portfolio Website. A desktop you can run as Ubuntu 20.4 (Linux), Windows 11 or macOS." />
            <meta name="author" content="Helmi Lakhder(Helmi)" />
            <meta name="keywords"
                content="Helmi Lakhder, Helmi Lakhder's portfolio, helmi linux, ubuntu portfolio, Helmi Lakhder portfolio,Helmi Lakhder , Helmi Lakhder, Helmi ubuntu, Helmi Lakhder ubuntu portfolio, windows 11 portfolio, macos portfolio, Helmi Lakhder windows 11 portfolio, Helmi Lakhder macos portfolio" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#E95420" />

            /* Search Engine */
            <meta name="image" content="images/logos/e-logo.svg" />
            /* Schema.org for Google */
            <meta itemProp="name" content="Helmi Lakhder Portfolio" />
            <meta itemProp="description"
                content="Helmi Lakhder's (Helmi) Personal Portfolio Website. Made with Ubuntu 20.4 (Linux), Windows 11 and macOS themes by Next.js and Tailwind CSS." />
            <meta itemProp="image" content="images/logos/e-logo.svg" />
            /* Twitter */
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Helmi Lakhder - Ubuntu, Windows 11 and macOS VM" />
            <meta name="twitter:description"
                content="Helmi Lakhder's (Helmi) Personal Portfolio Website. Made with Ubuntu 20.4 (Linux), Windows 11 and macOS themes by Next.js and Tailwind CSS." />
            <meta name="twitter:site" content="Helmi Lakhder" />
            <meta name="twitter:creator" content="Helmi Lakhder" />
            <meta name="twitter:image:src" content="images/logos/e-logo.svg" />
            /* Open Graph general (Facebook, Pinterest & Google+) */
            <meta name="og:title" content="Helmi Lakhder Portfolio" />
            <meta name="og:description"
                content="Helmi Lakhder's (Helmi) Personal Portfolio Website. Made with Ubuntu 20.4 (Linux), Windows 11 and macOS themes by Next.js and Tailwind CSS." />
            <meta name="og:image" content="images/logos/e-logo.svg" />
            <meta name="og:url" content="https://github.com/HelmiDev03" />
            <meta name="og:site_name" content="Helmi Lakhder Personal Portfolio" />
            <meta name="og:locale" content="en_IN" />
            <meta name="og:type" content="website" />

            <link rel="icon" href="images/logos/ubuntu_icon.png" key="favicon" />
            <link rel="apple-touch-icon" href="images/logos/ubuntu_icon.png" key="apple-touch-icon" />
            <link rel="preload" href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" as="style" />
            <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
        </Head>
    )
}
