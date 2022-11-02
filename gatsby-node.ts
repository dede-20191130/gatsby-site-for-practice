import type { GatsbyGraphQLType, GatsbyNode, Actions, NodePluginArgs } from "gatsby"
import { createRemoteFileNode } from 'gatsby-source-filesystem';
import dotenv from 'dotenv';
import { v2 as v2cloudinary } from 'cloudinary';

export interface CludinaryFolderResponse {
    folders?: CldFolder[]
    next_cursor?: any
    total_count?: number
    error?: CldError
}

export interface CldFolder {
    name: string
    path: string
}

export interface CldError {
    message: string
}


dotenv.config();

v2cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

function createNewNodesLocally(
    createNode: Actions["createNode"],
    createNodeId: NodePluginArgs["createNodeId"],
    createContentDigest: NodePluginArgs["createContentDigest"]
) {
    const POST_NODE_TYPE = `DummyPost`
    const data = {
        posts: [
            { id: 1, description: `Hello world!` },
            { id: 2, description: `Second post!` },
        ],
    }

    // loop through data and create Gatsby nodes
    data.posts.forEach(post =>
        createNode({
            ...post,
            id: createNodeId(`${POST_NODE_TYPE}-${post.id}`),
            parent: null,
            children: [],
            internal: {
                type: POST_NODE_TYPE,
                contentDigest: createContentDigest(post),
            },
        })
    )
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
    ({ actions, reporter, createNodeId, createContentDigest, schema }) => {
        const { createTypes, createFieldExtension, createNode } = actions

        createNewNodesLocally(createNode, createNodeId, createContentDigest)

        createFieldExtension({
            name: 'shout',
            extend: () => ({
                resolve(source, args, context, info) {
                    // reporter.info(JSON.stringify(source))
                    // reporter.info(JSON.stringify(args))
                    // reporter.info(JSON.stringify(context))
                    // reporter.info(JSON.stringify(info))
                    return String(source[info.fieldName]).toUpperCase()
                }
            })
        })
        createFieldExtension({
            name: 'motivate',
            args: {
                caffeine: 'Int'
            },
            extend(options, prevFieldConfig) {
                return {
                    type: 'String',
                    args: {
                        sunshine: {
                            type: 'Int',
                            defaultValue: 0,
                        },
                    },
                    resolve(source, args, context, info) {
                        const motivation = (options.caffeine || 0) - args.sunshine
                        if (motivation > 5) return 'Work! Work! Work!'
                        return 'Maybe tomorrow.'
                    },
                }
            },
        });

        const typeDefs = [`
      type AuthorJson implements Node {
        joinedAt: Date
        motivationValue:String @motivate(caffeine: 20)
        posts: [Mdx] @link(by: "frontmatter.author.email", from: "email") # easy back-ref
      }
      type Mdx implements Node {
        frontmatter: Frontmatter
      }
      type Frontmatter {
        tagline: String @shout
        author: AuthorJson @link(by: "email", from: "author.email") # default foreign-key relation by id
        reviewers: [AuthorJson] @link(by: "email") # foreign-key relation by custom field
      }
  
    `,
            schema.buildObjectType({
                name: "CloudinaryFolder",
                fields: {
                    foldername: "String!",
                    folderpath: "String!",
                    cloudinaryMedias: {
                        type: ["CloudinaryMedia"],
                        extensions: {
                            link: {
                                from: "folderpath",
                                by: "folder"
                            }
                        }
                    }
                },
                interfaces: ["Node"]
            })
        ]

        createTypes(typeDefs)
    };

export const createResolvers: GatsbyNode["createResolvers"] = ({ createResolvers }) => {
    const resolvers = {
        Query: {
            contributorsWithSwag: {
                type: ["ContributorJson"],
                resolve: async (source, args, context, info) => {
                    const { entries } = await context.nodeModel.findAll({
                        query: {
                            filter: {
                                receivedSwag: { eq: true },
                            },
                        },
                        type: "ContributorJson",
                    })

                    return entries
                },
            },
        },
    }
    createResolvers(resolvers)
}

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
    actions,
    createNodeId,
    createContentDigest
}) => {
    const { createNode } = actions;

    // createNode({
    //     id: "test-1",
    //     internal: {
    //         type: `CloudinaryFolder`,
    //         contentDigest: "for test"
    //     },
    //     foldername: "samples/animals"
    // })

    const cldFolderInfo: CludinaryFolderResponse =
        await v2cloudinary.api.sub_folders("samples", { max_results: 300 })
    if (cldFolderInfo.error) throw new Error(cldFolderInfo.error.message);

    if (cldFolderInfo.folders) {
        for (const folderInfo of cldFolderInfo.folders) {
            createNode({
                id: createNodeId(folderInfo.path),
                internal: {
                    type: `CloudinaryFolder`,
                    contentDigest: createContentDigest(folderInfo),
                },
                foldername: folderInfo.name,
                folderpath: folderInfo.path,
            })

        }
    };

}

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({
    node,
    actions: { createNode, createNodeField },
    createNodeId,
    getCache,
    reporter
}) => {
    // if(node.internal.type === "Mdx" )reporter.info((node.frontmatter as any).hero_image.toString())
}


