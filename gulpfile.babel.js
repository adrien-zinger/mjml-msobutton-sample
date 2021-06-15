import gulp from 'gulp'
import babel from 'gulp-babel'
import watch from 'gulp-watch'
import log from 'fancy-log'
import fs from 'fs'
import path from 'path'
import mjml2html from 'mjml'
import { registerComponent } from 'mjml-core'
import MjMsoButton from 'mjml-msobutton'

const compile = () => gulp
  .src(path.normalize('components/**/*.js'))
  .pipe(babel({
    presets: ['@babel/preset-env'],
  }))
  .on('error', log)
  .pipe(gulp.dest('lib'))
  .on('end', () => {
    registerComponent(MjMsoButton)
    fs.readFile(path.normalize('./index.mjml'), 'utf8', (err, data) => {
      if (err) throw err
      const result = mjml2html(data)
      fs.writeFileSync(path.normalize('./index.html'), result.html)
    })
  })

gulp.task('build', compile)

gulp.task('watch', () => {
  compile()
  return watch([path.normalize('components/**/*.js'), path.normalize('index.mjml')], compile)
})
