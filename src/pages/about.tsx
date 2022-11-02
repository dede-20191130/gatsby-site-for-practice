import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

// Step 2: Define your component
const AboutPage = () => {
    return (
        <Layout pageTitle="About Me">
            <main>
                <Link to="/">Back to Home</Link>
                <p>Hi there! I'm the proud creator of this site, which I built with Gatsby.</p>
            </main>
        </Layout>
    )
}

// Step 3: Export your component
export default AboutPage

export const Head = () => <Seo title="About Me" />