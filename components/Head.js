import React, { PureComponent } from "react";
import HeadInjection from "next/head";

export default class Head extends PureComponent {
  render() {
    return (
      <HeadInjection>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        {/* <link rel="manifest" href="%PUBLIC_URL%/assets/manifest.json?v=1.0"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>

        <link href="%PUBLIC_URL%/assets/logo.png?v=1.0" rel="shortcut icon" type="image/png" sizes="any"/>
        <link href="%PUBLIC_URL%/assets/logo.svg?v=1.0" rel="shortcut icon" type="image/svg+xml" sizes="any"/>
        <link href="%PUBLIC_URL%/assets/logo.png?v=1.0" rel="apple-touch-icon" type="image/png" sizes="any"/>
        <link href="%PUBLIC_URL%/assets/logo-black.svg?v=1.0" rel="mask-icon" color="#000" type="image/svg+xml"/>

        <meta content="https://<TODO: URL>%PUBLIC_URL%/assets/logo.png?v=1.0" property="og:image"/>
        <meta content="256" property="og:image:width"/>
        <meta content="256" property="og:image:height"/> */}

                <title>World Prototype</title>
        <meta content="World Prototype" property="og:title"/>

        {/* <meta content="TODO: NO DESCRIPTION" name="description"/>
        <meta content="TODO: NO DESCRIPTION" property="og:description"/>

        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="TODO: TWITTER"/> */}

        <style>
          {`* {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
            user-select: none;
          }

          html {
            background: #000;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            tap-highlight-color: rgba(0,0,0,0);
          }

          canvas, #root {
            -webkit-animation: enter-fade 414ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
                    animation: enter-fade 414ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
          }
          @keyframes enter-fade {
            0%   { opacity: 0; }
            100% { opacity: 1; }
          }

          #spin {
            -webkit-animation: spin 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
                    animation: spin 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
            width: 2rem;
            height: 2rem;
            position: absolute;
            left: 0; top: 0; right: 0; bottom: 0;
            margin: auto;
            border: 0.25rem solid transparent;
            border-top-color: #fff;
            border-bottom-color: #fff;
            border-radius: 50%;
            color: transparent;
          }

          @keyframes spin {
            0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg);   }
            100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
          }`}
        </style>
      </HeadInjection>
    );
  }
}
