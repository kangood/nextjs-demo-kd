const path = require("path");

// 用 semi-next 包裹一层配置文件，进行默认导入样式的去除
const semi = require("@douyinfe/semi-next").default({});

module.exports = semi({
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname),
        };
        return config;
    },
    images: {
        domains: ["localhost", "127.0.0.1"],
    },
});
