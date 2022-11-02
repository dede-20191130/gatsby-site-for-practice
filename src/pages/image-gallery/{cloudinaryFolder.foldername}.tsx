import * as React from 'react'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { graphql } from 'gatsby';
import type { PageProps } from 'gatsby';
import { ReactNode } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const Gallery =
  // ()=>"test";
  ({ data, children }: PageProps<{ cloudinaryFolder: Queries.CloudinaryFolder }>) => {
    console.log(data)
    return (
      <Layout pageTitle={data.cloudinaryFolder.foldername || ""}>
        <>
          {data.cloudinaryFolder.cloudinaryMedias?.map((media => {
            return <p key={media?.secure_url}><img src={media?.secure_url || ""} width={300}></img></p>
          }))}
          {children}
        </>
      </Layout>
    )
  }

export const Head = ({ data }: PageProps<{ cloudinaryFolder: Queries.CloudinaryFolder }>) => <Seo title={data.cloudinaryFolder.foldername} />

export const query = graphql`
query CloudinaryFolderData($id: String) {
  cloudinaryFolder(id: {eq: $id}) {
    foldername
    cloudinaryMedias {
      secure_url
    }
  }
}
`

export default Gallery