const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')


app.set('view engine','ejs')
app.set('views', __dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit:'50mb', extended:true}))
app.use(methodOverride('_method'))

app.use('/',indexRouter)
app.use('/authors',authorRouter)
app.use('/books', bookRouter)

const mongoose = require('mongoose')
mongoose.connect( 'mongodb://127.0.0.1:27017/mylibrary' , {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
})

app.listen(process.env.port || 3000, ()=>{
	console.log('server is started')
})