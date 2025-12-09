const express=require('express');
const { listScholarships, createScholarship, getScholarship, saveScholarship } = require('../controller/scholarshipsControllers');
const router=express.Router();

router.get('/',listScholarships)
router.post('/',createScholarship)
router.get('/:id',getScholarship)
router.post('/:id/save',saveScholarship);

module.exports=router