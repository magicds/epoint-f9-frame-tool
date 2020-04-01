/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
/* eslint-env node, es6 */
const path = require('path');
module.exports = {
    ui: {
        port: 3001,
        weinre: {
            port: 8080
        }
    },
    files: [
        // eslint-disable-next-line
        'frame/projects/**/*.html',
        'frame/projects/**/*.js',
        'frame/projects/**/*.css',
        'frame/fui/**/*.js',
        'frame/fui/**/*.css'
    ],
    watchEvents: ['change', 'add', 'addDir'],
    watchOptions: {
        ignoreInitial: true,
        ignored: ['*.txt', '*.png', '*.json', '*.scss', '**/*.scss', '**/*.css.map']
    },
    // 'server': true,
    // https: {
    //     key: path.resolve('D:\\tools\\nginx\\key\\localhost+3-key.pem'),
    //     cert: path.resolve('D:\\tools\\nginx\\key\\localhost+3.pem')
    // },
    server: {
        baseDir: './',
        routes: {
            '/ep94': './'
        },
        middleware: function(req, res, next) {
            if (/\.json|\.txt/.test(req.url) && req.method.toUpperCase() == 'POST') {
                // console.log(req);
                console.log('[BrowserSync] [POST => GET] : ' + req.url);
                req.method = 'GET';
                // console.log(res);
            }
            next();
        }
    },
    proxy: false,
    port: 3000,
    middleware: false,
    serveStatic: [],
    ghostMode: {
        clicks: true,
        scroll: true,
        location: true,
        forms: {
            submit: true,
            inputs: true,
            toggles: true
        }
    },
    logLevel: 'silent',
    // 'logLevel': 'info',
    // 'logLevel': 'debug',
    logPrefix: 'BrowserSync',
    logConnections: false,
    logFileChanges: true,
    logSnippet: true,
    rewriteRules: [],
    open: 'local',
    browser: 'default',
    cors: false,
    xip: false,
    hostnameSuffix: false,
    reloadOnRestart: false,
    notify: true,
    scrollProportionally: true,
    scrollThrottle: 0,
    scrollRestoreTechnique: 'window.name',
    scrollElements: [],
    scrollElementMapping: [],
    reloadDelay: 0,
    reloadDebounce: 0,
    reloadThrottle: 0,
    plugins: [],
    injectChanges: true,
    minify: true,
    host: null,
    localOnly: false,
    codeSync: true,
    timestamps: true,
    clientEvents: ['scroll', 'scroll:element', 'input:text', 'input:toggles', 'form:submit', 'form:reset', 'click'],
    socket: {
        socketIoOptions: {
            log: false
        },
        socketIoClientConfig: {
            reconnectionAttempts: 50
        },
        path: '/browser-sync/socket.io',
        clientPath: '/browser-sync',
        namespace: '/browser-sync',
        clients: {
            heartbeatTimeout: 5000
        }
    },
    tagNames: {
        less: 'link',
        // 'scss': 'link',
        css: 'link',
        jpg: 'img',
        jpeg: 'img',
        png: 'img',
        svg: 'img',
        gif: 'img',
        js: 'script'
    }
};
