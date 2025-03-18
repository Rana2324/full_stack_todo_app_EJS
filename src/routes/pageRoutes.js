import express from 'express';
import todoService from '../services/todoService.js';

//router
const router = express.Router();

//routes
router.get('/', async (req,res)=>{});
router.get("/add", async (req,res)=>{});
router.get("/edit/:id", async (req,res)=>{});

export default router;
