module.exports = {
    module: {
        name: 'pipServices',
        export: 'pip',
        standalone: 'pip.services'
    },

    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: false,
        less: false,
        lib: true,
        images: false,
        dist: false
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
