// import * as React from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import { ReactNode } from 'react'
import {
    container,
    heading,
    navLinks,
    navLinkItem,
    navLinkText
} from './layout.module.css'


const Layout = ({ pageTitle, children }: { pageTitle: string, children: ReactNode }) => {
    const data = useStaticQuery<Queries.LayoutDataQuery>(graphql`
    query LayoutData{
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
    return (
        <div className={container}>
            <header>{data.site?.siteMetadata?.title}</header>
            <nav>
                <ul className={navLinks}>
                    <li className={navLinkItem}>
                        <Link to="/" className={navLinkText}>
                            Home
                        </Link>
                    </li>
                    <li className={navLinkItem}>
                        <Link to="/about" className={navLinkText}>
                            About
                        </Link>
                    </li>
                    <li className={navLinkItem}>
                        <Link to="/blog" className={navLinkText}>
                            Blog
                        </Link>
                    </li>

                </ul>
            </nav>
            <main>
                <h1 className={heading}>{pageTitle}</h1>
                {children}
            </main>
        </div>
    )

}

export default Layout