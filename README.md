# The Giveth DApp

### Build status:
- Develop - [![build-develop](https://github.com/Giveth/giveth-dapps-v2/actions/workflows/Build.yml/badge.svg?branch=develop)](https://github.com/Giveth/giveth-dapps-v2/actions/workflows/Build.yml)
- Main - [![build-main](https://github.com/Giveth/giveth-dapps-v2/actions/workflows/Build.yml/badge.svg?branch=main)](https://github.com/Giveth/giveth-dapps-v2/actions/workflows/Build.yml)
--------------
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, set these envirnment variables in `env.local` file

```
NEXT_PUBLIC_ENV=
NEXT_PUBLIC_XDAI_NODE_URL=
NEXT_PUBLIC_NODE_URL=
NEXT_PUBLIC_INFURA_API_KEY=
```

`NEXT_PUBLIC_ENV` value can be empty or `production`.

`NEXT_PUBLIC_XDAI_NODE_URL` and `NEXT_PUBLIC_NODE_URL` are JRPC endpoints for xdai and mainnet (goerli in development env) networks.

`NEXT_PUBLIC_INFURA_API_KEY` is the infura api key.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
