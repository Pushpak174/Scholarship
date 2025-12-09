const express=require('express');
const { listScholarships, createScholarship, getScholarship, saveScholarship, updateScholarship, deleteScholarship } = require('../controller/scholarshipsControllers');
const router=express.Router();

router.get('/',listScholarships)
router.post('/',createScholarship)
router.get('/:id',getScholarship)
router.post('/:id/save',saveScholarship);
router.put('/:id',updateScholarship)
router.delete('/:id', deleteScholarship);

module.exports=router