module.exports = {
    module: {
        name: 'pipServices',
        export: 'pip.services',
        standalone: 'pip.services'
    },

    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: false,
        sass: false,
        lib: true,
        images: false,
        dist: false
    },

    file: {
        lib: [
            '../pip-webui-lib/dist/**/*'
        ]
    },

    browserify: {
        entries: [ './src/index.ts' ]
    },

    samples: {
        port: 8040
    },

    api: {
        port: 8041
    }
};
