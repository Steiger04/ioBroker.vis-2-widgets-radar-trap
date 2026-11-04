/*!
 * ioBroker gulpfile
 * Date: 2023-03-22
 */
'use strict';

const gulp = require('gulp');
const adapterName = require('./package.json').name.replace('iobroker.', '');
const { deleteFoldersRecursive, npmInstall, buildReact, copyFiles } = require('@iobroker/build-tools');

const SRC = 'src-widgets/';
const src = `${__dirname}/${SRC}`;

gulp.task('widget-0-clean', done => {
    deleteFoldersRecursive(`${src}build`);
    deleteFoldersRecursive(`${__dirname}/widgets`);
    done();
});
gulp.task('widget-1-npm', async () => npmInstall(src));

gulp.task('widget-2-compile', async () => buildReact(src, { rootDir: __dirname, vite: true }));

gulp.task('widget-3-copy', done => {
    // customWidgets.js, mf-manifest.json (vis-2 reads it to check the shared modules), assets/ and img/
    copyFiles([`${SRC}build/**/*`, `!${SRC}build/index.html`, `!${SRC}build/mf-stats.json`], `widgets/${adapterName}`);
    copyFiles([`${SRC}src/i18n/*.json`], `widgets/${adapterName}/i18n`);
    done();
});

gulp.task('widget-build', gulp.series(['widget-0-clean', 'widget-1-npm', 'widget-2-compile', 'widget-3-copy']));

gulp.task('default', gulp.series('widget-build'));
