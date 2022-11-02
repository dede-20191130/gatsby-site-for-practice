import { graphql, Link } from 'gatsby'
import * as React from 'react'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import type { PageProps, GatsbyBrowser } from "gatsby"

// // custom type->typegen type
// type DataProps = {
//   allMdx: {
//     nodes: {
//       id: number
//       frontmatter: {
//         date: string
//         slug: string
//         title: string
//       }
//       excerpt: string
//     }[]
//   }
// }


const BlogPage = ({ data }: PageProps<Queries.AllBlogDataQuery>) => {
  return (
    <Layout pageTitle="My Blog Posts">
      {
        data.allMdx.nodes.map((node) => (
          <article key={node.id}>
            <h2>
              <Link to={`/blog/${node.frontmatter?.slug}`}>
                {node.frontmatter?.title}
              </Link>
            </h2>
            <p>Posted: {node.frontmatter?.date}</p>
          </article>
        ))
      }
    </Layout>
  )
}

export const Head = () => <Seo title="My Blog Posts" />

export const query = graphql`
query AllBlogData{
  allMdx(sort: {fields: frontmatter___date, order: DESC}) {
    nodes {
      id
      frontmatter {
        date(formatString: "MMMM D, YYYY", fromNow: true)
        slug
        title
      }
      excerpt(pruneLength: 30)
    }
  }
}

`


export default BlogPage