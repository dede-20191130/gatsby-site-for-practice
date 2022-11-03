import * as React from 'react'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { graphql, useStaticQuery } from 'gatsby';
import type { PageProps } from 'gatsby';
import { ReactNode } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export async function config() {
    // Optionally use GraphQL here

    return ({ params }) => {
        return {
            defer: true,
        }
    }
}


const BlogPost = ({ data, children }: PageProps<Queries.FoodQueryQuery>) => {
    //   console.log(data);

    // const image = getImage(data.cloudinaryFolder?.cloudinaryMedias)

    return (
        <Layout pageTitle={"transforming food"}>
            {data.fBlurred?.cloudinaryMedias &&
                data.fTraced?.cloudinaryMedias &&
                data.fNone?.cloudinaryMedias &&
                <div style={{
                    width: "900px",
                    display: "flex",
                    flexWrap: "wrap"
                }
                }>
                    <>
                        {Array(5).fill(undefined).map((_item: any) => {
                            return <>
                                {data.fNone?.cloudinaryMedias!.map(media => {
                                    const image = getImage(media?.gatsbyImageData || null);
                                    return image ? <GatsbyImage
                                        key={media?.id}
                                        image={image}
                                        alt={media?.id || ""}
                                        style={{
                                            width: "300px"
                                        }}
                                        backgroundColor={"#d7d7d7"}
                                    /> : <div key={media?.id}></div>

                                })}
                                {data.fBlurred?.cloudinaryMedias!.map(media => {
                                    const image = getImage(media?.gatsbyImageData || null);
                                    return image ? <GatsbyImage
                                        key={media?.id}
                                        image={image}
                                        alt={media?.id || ""}
                                        style={{
                                            width: "300px"
                                        }}
                                    /> : <div key={media?.id}></div>

                                })}
                                {data.fTraced!.cloudinaryMedias!.map(media => {
                                    const image = getImage(media?.gatsbyImageData || null);
                                    return image ? <GatsbyImage
                                        key={media?.id}
                                        image={image}
                                        alt={media?.id || ""}
                                        style={{
                                            width: "300px"
                                        }}
                                    /> : <div key={media?.id}></div>

                                })}
                            </>
                        })}
                    </>

                    {data.fBlurred?.cloudinaryMedias.map(media => {
                        const image = getImage(media?.gatsbyImageData || null);
                        return image ? <GatsbyImage
                            key={media?.id}
                            image={image}
                            alt={media?.id || ""}
                            style={{
                                width: "300px"
                            }}
                        /> : <div key={media?.id}></div>

                    })}
                    {data.fTraced.cloudinaryMedias.map(media => {
                        const image = getImage(media?.gatsbyImageData || null);
                        return image ? <GatsbyImage
                            key={media?.id}
                            image={image}
                            alt={media?.id || ""}
                            style={{
                                width: "300px"
                            }}
                        /> : <div key={media?.id}></div>

                    })}
                </div>
            }


            {children}
        </Layout >
    )
}

export const Head = ({ data }: { data: any }) => <style>{"main{width: 1000px}"}</style>

export const query = graphql`
query FoodQuery {
  fBlurred: cloudinaryFolder(foldername: {eq: "food"}) {
    cloudinaryMedias {
      gatsbyImageData(placeholder: BLURRED)
      id
    }
  }
  fTraced: cloudinaryFolder(foldername: {eq: "food"}) {
    cloudinaryMedias {
      gatsbyImageData(placeholder: TRACED_SVG)
      id
    }
  }
  fNone: cloudinaryFolder(foldername: {eq: "food"}) {
    cloudinaryMedias {
      gatsbyImageData(placeholder: NONE, transformations: "", outputPixelDensities: 1)
      id
    }
  }
}

`

export default BlogPost