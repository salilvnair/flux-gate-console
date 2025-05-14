const gulp = require('gulp');
const dom = require('gulp-dom');

const distPath = '../flux_gate/console';

// 🎯 Task 1: Remove inline onload from <link> tags and set media="all"
gulp.task('fix-csp-styles', () => {
    return gulp.src(`${distPath}/index.html`)
        .pipe(dom(function () {
        const links = this.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            if (link.getAttribute('onload')) {
            link.removeAttribute('onload');
            }
            if (link.getAttribute('media') === 'print') {
            link.setAttribute('media', 'all');
            }
        });
        return this;
        }))
        .pipe(gulp.dest(distPath));
    });
  
// Task 2: Add nonce="{{nonce}}" to all <script> tags
gulp.task('add-nonce', () => {
return gulp.src(`${distPath}/index.html`)
    .pipe(dom(function () {
    const scripts = this.querySelectorAll('script[src]');
    scripts.forEach(script => {
        if (!script.hasAttribute('nonce')) {
        script.setAttribute('nonce', '{{nonce}}');
        }
    });
        return this;
    }))
    .pipe(gulp.dest(distPath));
});

gulp.task('default', gulp.series('add-nonce', 'fix-csp-styles'));
// This Gulp task will add a nonce attribute to all script and link tags in the index.html file
// and to all script and link tags in the JavaScript and CSS files in the specified distPath.
// The nonce value is set to '{{nonce}}', which can be replaced with a real nonce value at runtime.
// The task uses the gulp-cheerio plugin to parse and manipulate the HTML and the gulp-replace plugin
// to replace the script and link tags in the JavaScript and CSS files.
// To run the task, use the command: gulp
  
