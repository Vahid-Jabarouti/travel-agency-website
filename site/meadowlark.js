const express = require('express')
const path = require('path')
const multiparty = require('multiparty')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const handlers = require('./lib/handler')
const port = process.env.PORT || 3000;

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

//configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', 'handlebars')

// Require static assets from public folder
app.use(express.static(path.join(__dirname, '/public')))

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'))

app.get('/', handlers.home)

app.get('/about', handlers.about)

// handlers for browser-based form submission
app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)

// handlers for fetch/JSON form submission
app.get('/newsletter', handlers.newsletter)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)

// vacation photo contest
app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax)
app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if(err) return handlers.vacationPhotoContestProcessError(req, res, err.message)
    console.log('got fields: ', fields)
    console.log('and files: ', files)
    handlers.vacationPhotoContestProcess(req, res, fields, files)
  })
})
app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoContestProcessThankYou)
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if(err) return handlers.api.vacationPhotoContestError(req, res, err.message)
    handlers.api.vacationPhotoContest(req, res, fields, files)
  })
})

//custom 404 page
app.use(handlers.notFound)

//custom 500 page
app.use(handlers.serverError)

app.listen(port, () => console.log(`Server started on port ${port}` + 
  ' Press Ctrl-C to terminate...'))

