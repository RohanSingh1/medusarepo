import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
    // Stripe requires a real apiKey to boot at all - only register it once
    // one is actually configured, otherwise the whole Payment module (and
    // the server) fails to start.
    ...(process.env.STRIPE_API_KEY
      ? [
          {
            resolve: "@medusajs/medusa/payment",
            options: {
              providers: [
                {
                  resolve: "@medusajs/payment-stripe",
                  id: "stripe",
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                  },
                },
              ],
            },
          },
        ]
      : []),
    {
      resolve: "./src/modules/product-feature",
    },
    // Local file storage defaults `backend_url` to "http://localhost:9000/static"
    // no matter where it's actually running, which breaks every uploaded
    // image in production. Point it at Railway's own public-domain env var
    // instead. (Where the files are written is NOT configurable here -
    // Express always serves "/static" from "<cwd>/static" - so the Railway
    // volume for this service is mounted at that same path directly rather
    // than overriding `upload_dir`.)
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              backend_url: process.env.RAILWAY_PUBLIC_DOMAIN
                ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/static`
                : undefined,
            },
          },
        ],
      },
    },
  ],
})
