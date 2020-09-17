const express = require('express')
const router = express.Router()
const Authors = require('../models/authors')
const Book =    require('../models/book')

router.get('/' , async (req , res) =>{
	 let searchOptions = {}
	 if (req.query.name != null && req.query.name !== ''){
		 searchOptions.name = new RegExp(req.query.name , 'i')
	 }

	 try{
		const authors = await Authors.find(searchOptions)
		res.render('authors/index' , 
        {
			authors : authors,
			searchOptions: req.query
		})
	 } catch(e) {
		res.redirect('/')
	 }
})

router.get('/new', (req,res) =>{
	res.render('authors/new', { author : new Authors()})
})

router.post('/' , async (req,res) =>{
  const author = new Authors({
		name: req.body.name
  })

  try {
	  const newAuthor = await author.save()
	  res.redirect(`authors/${newAuthor.id}`)
  } catch (e){	 
	res.render('authors/new',{
		author:author,
		error:"error creating Author"
	})
  }
})

router.get('/:id' ,async (req , res) => {
	try {
		const author = await Authors.findById(req.params.id)
		const books = await Book.find({ author: author.id }).limit(6).exec()
		res.render('authors/show', {
		  author: author,
		  booksByAuthor: books
		})
	} catch (e) {
		res.redirect('/')
	}
		
})

router.get('/:id/edit' , async (req , res) => {
	try {
		const author = await Authors.findById(req.params.id)
        res.render('authors/edit', { author : author})
	} catch (e) {
	    res.redirect('/authors')	
	}
	
})

router.put('/:id' ,async (req,res) => {
   let author
  try {
	  author = await Authors.findById(req.params.id)
	  author.name = req.body.name
	  await author.save()
	  res.redirect(`/authors/${author.id}`)
  } catch (e){	 
	  if (author == null)
	  {
		  res.redirect('/')
	  }else{
		    res.render('authors/edit',{
			author:author,
			error:"error Updating author"
		})
	  }
  }
})

router.delete('/:id', async(req , res) => {
	let author
	try {
		author = await Authors.findById(req.params.id)
		await author.remove()
		res.redirect('/authors')
	} catch (e){	 
		if (author == null)
		{
			res.redirect('/')
		}else{
			 res.redirect(`/authors/${author.id}`)
		}
	}
})

module.exports = router