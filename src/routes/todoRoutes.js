import express from 'express';
import  todoController  from '../controllers/todoController.js';

//router
const router = express.Router();

//routes
router.get('/', todoController.getTodos);
router.get('/:id', todoController.getTodo);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

//get status
router.get('/status', todoController.getStatus);
//toggle status
router.put('/status/:status', todoController.toggleStatus);

export default router;

