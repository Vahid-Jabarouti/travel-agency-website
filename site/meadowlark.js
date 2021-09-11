const express = require('express')
const path = require('path')
const expressHandlebars = require('express-handlebars')
const fortune = require('./lib/fortune')
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

app.get('/', (req, res) => res.render('home'))

app.get('/about', (req, res) => {
  const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
  res.render('about', {fortune: fortune.getFortune()})
})

//custom 404 page
app.use((req, res) => {
  res.status(404)
  res.render('404')
})

//custom 500 page
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.render('500')
})

app.listen(port, () => console.log(`Server started on port ${port}` + 
  ' Press Ctrl-C to terminate...'))

