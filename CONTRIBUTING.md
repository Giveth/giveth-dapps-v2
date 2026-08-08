NEXT_PUBLIC_ENV=
NEXT_PUBLIC_XDAI_NODE_URL=
NEXT_PUBLIC_NODE_URL=
NEXT_PUBLIC_INFURA_API_KEY=

- `NEXT_PUBLIC_ENV` - Leave empty for development or set to `production`
- `NEXT_PUBLIC_XDAI_NODE_URL` - JRPC endpoint for Gnosis Chain (xDai)
- `NEXT_PUBLIC_NODE_URL` - JRPC endpoint for Ethereum Mainnet
- `NEXT_PUBLIC_INFURA_API_KEY` - Your Infura API key

### 6. Run the Development Server

```bash
yarn dev
```

## Development Workflow

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Run linting before committing:

```bash
yarn lint
yarn lint:fix
```

## Submitting Changes

1. Commit with clear messages: `git commit -m "docs: description"`
2. Push to your fork: `git push origin your-branch-name`
3. Create a Pull Request on GitHub

## Getting Help

- Check existing issues: https://github.com/Giveth/giveth-dapps-v2/issues
- Join Discord: https://discord.giveth.io

---

**Thank you for contributing to Giveth!** 💜
