# Shopify Remix App Template

This repository serves as a **starter template** for building Shopify apps using Remix, Vite, Prisma, and the Shopify CLI. Follow the steps below to scaffold and run a brand-new Shopify app based on this template.

---

## Prerequisites

1. **Node.js** (18 or 20 recommended)  
2. **npm** (version 8 or newer)  
3. **Shopify CLI**  

```bash
npm install -g @shopify/cli@latest
```

---

## Quick Start

1. **Use this Template**  
   - Click the **“Use this template”** button in this repository to create **your own** new repository.

2. **Clone Your New Repo**  

```bash
git clone https://github.com/your-account/your-new-repo.git 
cd your-new-repo
```

3. **Install Dependencies**  

```bash
npm install
```

4. **Link (and Create) Your Shopify App**

```bash
shopify app config link
```

- If you have multiple partner organizations, select one.  
- Choose **“Yes, create a new app.”**  
- Enter your **new app name** when prompted.  

A **new** Shopify app will appear in your [Partner Dashboard](https://partners.shopify.com/).

5. **Start Development**

```bash
shopify app dev
```

- This runs local servers and opens a secure tunnel, letting you preview and test your app.

---

## Next Steps

- Update the `scopes` in **`shopify.app.toml`** to match the permissions your app needs.  
- Explore **`src/`** to see your Remix + Vite project structure and start customizing routes, components, etc.  
- Add or customize **extensions** in the `extensions` folder if desired.  
- When you’re ready to deploy, see the Shopify docs on [deploying your app](https://shopify.dev/docs/apps).

---

## License

This project is released under [The Unlicense](https://unlicense.org/).
