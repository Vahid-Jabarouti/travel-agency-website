const express = require('express')
const path = require('path')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handler')
const port = process.env.PORT || 3000;

const app = express()

//configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Require static assets from public folder
app.use(express.static(path.join(__dirname, '/public')))

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'))

app.get('/', handlers.home)

app.get('/about', handlers.about)

//custom 404 page
app.use(handlers.notFound)

//custom 500 page
app.use(handlers.serverError)

app.listen(port, () => console.log(`Server started on port ${port}` + 
  ' Press Ctrl-C to terminate...'))

