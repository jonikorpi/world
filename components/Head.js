import React, { PureComponent } from "react";
import HeadInjection from "next/head";

export default class Head extends PureComponent {
  render() {
    return (
      <HeadInjection>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" href="/static/reset.css" />
        <link rel="stylesheet" href="/static/baseline.css" />
        <link rel="stylesheet" href="/static/fonts.css" />

        {/* <link rel="manifest" href="%PUBLIC_URL%/assets/manifest.json?v=1.0"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>

        <link href="%PUBLIC_URL%/assets/logo.png?v=1.0" rel="shortcut icon" type="image/png" sizes="any"/>
        <link href="%PUBLIC_URL%/assets/logo.svg?v=1.0" rel="shortcut icon" type="image/svg+xml" sizes="any"/>
        <link href="%PUBLIC_URL%/assets/logo.png?v=1.0" rel="apple-touch-icon" type="image/png" sizes="any"/>
        <link href="%PUBLIC_URL%/assets/logo-black.svg?v=1.0" rel="mask-icon" color="#000" type="image/svg+xml"/>

        <meta content="https://<TODO: URL>%PUBLIC_URL%/assets/logo.png?v=1.0" property="og:image"/>
        <meta content="256" property="og:image:width"/>
        <meta content="256" property="og:image:height"/> */
        }

        <title>World Prototype</title>
        <meta content="World Prototype" property="og:title" />

        {/* <meta content="TODO: NO DESCRIPTION" name="description"/>
        <meta content="TODO: NO DESCRIPTION" property="og:description"/>

        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:site" content="TODO: TWITTER"/> */
        }

      </HeadInjection>
    );
  }
}
