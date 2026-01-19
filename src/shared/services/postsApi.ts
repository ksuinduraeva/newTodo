import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export const postsApi = createApi({
    reducerPath: "postsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://jsonplaceholder.typicode.com/",
    }),
    tagTypes: ["Posts"],
    endpoints: (build) => ({
        getPosts: build.query<Post[], void>({
            query: () => "posts",
            providesTags: (posts) =>
                posts
                    ? [
                        ...posts.map((post) => ({ type: "Posts" as const, id: post.id })),
                        { type: "Posts" as const, id: "LIST" },
                    ]
                    : [{ type: "Posts" as const, id: "LIST" }],
        }),
        getPostById: build.query<Post, number>({
            query: (id) => `posts/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Posts" as const, id }],
        }),
        deletePost: build.mutation<void, number>({
            query: (id) => ({ url: `posts/${id}`, method: "DELETE" }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Posts" as const, id },
                { type: "Posts" as const, id: "LIST" },
            ],
        }),
    }),
});

export const { useGetPostsQuery, useGetPostByIdQuery } = postsApi;
