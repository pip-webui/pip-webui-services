module.exports = {
    module: {
        name: 'pipServices'
    },

    build: {
        js: true,
        ts: true,
        html: false,
        css: false,
        lib: true,
        images: false,
        dist: false
    },

    typescript: {
        noImplicitAny: false,
        declaration: true
    },

    file: {
        lib: [
            '../pip-webui-lib/dist/**/*'
        ]
    },

    samples: {
        port: 8040
    },

    api: {
        port: 8041
    }
};
