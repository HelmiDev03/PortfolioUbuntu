import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="google-site-verification" content="9Bhh1W8AaiTPEzdeeIGoKs_2ob3s3kEClgedviD8T4U" />
        </Head>
        <body>
          {/* The page is pre-rendered as Ubuntu. Tell the stylesheet early which
              OS the visitor chose, so the Ubuntu boot logo is not shown to
              Windows / macOS visitors while the page loads. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `try{var os=localStorage.getItem("os-theme");if(os)document.documentElement.setAttribute("data-os",os)}catch(e){}`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
