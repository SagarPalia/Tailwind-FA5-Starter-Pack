const { series, src, dest, task, watch } = require('gulp'),
	sass = require('gulp-dart-sass'),
	postcss = require('gulp-postcss'),
	csso = require('gulp-csso'),
	purgecss = require('gulp-purgecss'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create();

// Move Font Awesome Fonts to dist
task('FontAwesome', () => {
	return src(['node_modules/@fortawesome/fontawesome-free/webfonts/**'])
		.pipe(dest('dist/webfonts'))
		.pipe(browserSync.stream());
});

// SCSS TO CSS
task('scss', () => {
	return src(['dist/scss/*.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([require('tailwindcss'), require('autoprefixer')]))
		.pipe(csso())
		.pipe(dest('dist/css'))
		.pipe(browserSync.stream());
});

// Watch
task(
	'watch',
	series('scss', (cb) => {
		browserSync.init({
			server: './dist',
			injectChanges: false,
		});
		watch(['dist/scss/*.scss', 'dist/scss/*/*.scss'], task('scss'));
		watch(['dist/css/*.css', 'dist/js/*.js', 'dist/*.html']).on(
			'change',
			browserSync.reload
		);
		cb();
	})
);

// Purge CSS
task('purge', () => {
	return src('dist/css/tailwind.css')
		.pipe(
			purgecss({
				content: ['dist/**/*.html'],
				defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
				whitelist: ['class-1', 'class-2'],
			})
		)
		.pipe(dest('dist/css'));
});

// Default
task('default', series('FontAwesome', 'scss', 'watch'));
