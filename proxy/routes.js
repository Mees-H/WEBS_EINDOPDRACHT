const ROUTES = [
    {
        url: '/free',
        proxy: {
            target: "https://www.bing.com",
            changeOrigin: true,
            pathRewrite: {
                [`^/free`]: '',
            },
        }
    },
    {
        url: '/premium',
        proxy: {
            target: "https://www.google.com",
            changeOrigin: true,
            pathRewrite: {
                [`^/premium`]: '',
            },
        }
    },
    {
        url: '/rooster',
        proxy: {
            target: "https://localhost:3001",
            changeOrigin: true,
            pathRewrite: {
                [`^/rooster`]: '',
            },
        }
    }
]

exports.ROUTES = ROUTES;