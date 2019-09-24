const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geoCode')
const forecast = require('./utils/forecast')

const app = express()

const port = process.env.PORT || 3002

//Define paths for Express config
const publicDirectoryPath=path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Janis Dre'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpName: 'haha',
        title: 'Help',
        name: 'Janis Drege'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Sam 2'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })  
    }

    geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

    //     res.send({
    //     forecast: 'It is raining',
    //     location: 'Riga',
    //     address: req.query.address
    // })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })        
    }
    
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help article not found',
        name: 'John'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not found',
        name: 'Same John'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})