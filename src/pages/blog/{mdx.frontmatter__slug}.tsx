import * as React from 'react'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { graphql } from 'gatsby';
import type { PageProps } from 'gatsby';
import { ReactNode } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const BlogPost = ({ data, children }: PageProps<Queries.BlogPostDataQuery>) => {
  let heroimage = data.mdx?.frontmatter?.hero_image as DeepNonNullable<
    NonNullable<
      NonNullable<
        typeof data["mdx"]
      >["frontmatter"]
    >["hero_image"]
  >
  const image = getImage(heroimage)

  return (
    <Layout pageTitle={data.mdx?.frontmatter?.title || ""}>
      <p>{data.mdx?.frontmatter?.date}</p>
      {image && <>
        <GatsbyImage
          image={image}
          alt={data.mdx?.frontmatter?.hero_image_alt || ""}
        />
        <p>
          Photo Credit:{" "}
          <a href={data.mdx?.frontmatter?.hero_image_credit_link || ""}>
            {data.mdx?.frontmatter?.hero_image_credit_text}
          </a>
        </p>
      </>}
      {children}
    </Layout>
  )
}

export const Head = ({ data }: { data: any }) => <Seo title={data.mdx.frontmatter.title} />

export const query = graphql`
  query BlogPostData($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        hero_image_alt
        hero_image_credit_link
        hero_image_credit_text
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`

export default BlogPost