import todoService from '../services/todoService.js';
import { logger } from '../utils/logger.js';

const todoController = {
    getTodos:async (req,res)=>{
        try {
            const todos = await todoService.getTodos();
            res.status(200).json({
                success:true,
                todos
            })
            
        } catch (error) {
            logger.error('Error in getTodos:', error);
            res.status(500).json({
                success:false,
                error:error.message
            })
            
        }


    },
    getTodo:async (req,res)=>{
        try {
            const todo = await todoService.getTodo(req.params.id)
            if(!todo){
                res.status(404).json({
                    success:false,
                    error:`Todo with id ${req.params.id} not found`
                })
                return
            }
            res.status(200).json({
                success:true,
                todo
            })
            
        } catch (error) {
            logger.error('Error in getTodo:', error);
            res.status(500).json({
                success:false,
                error:error.message
            })
            
        }
        
    },
    createTodo:async (req,res)=>{
        try {
            const {title,description,status} = req.body;
            if(!title){
                return res.status(400).json({
                    success: false,
                    error: 'Title is required'
                });
            }
            const todo = await todoService.createTodo({
                title,
                description:description || "",
                status:status || "pending"
            });
            res.status(201).json({
                success:true,
                todo
            });
        } catch (error) {
            logger.error('Error in createTodo:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
 
    updateTodo:async (req,res)=>{
        try {
            const {id,title,description} = req.body;
            if(!id){
                throw new Error('Id is required');
            }
            if(!title){
                throw new Error('Title is required');
            }
            const todo = await todoService.updateTodo({
                id,
                title,
                description:description || ""
            });
            res.status(200).json({
                success:true,
                todo
            })

            
        } catch (error) {
            logger.error('Error in updateTodo:', error);
            throw new Error(`Error updating todo: ${error.message}`);
            
        }
        
    },
    deleteTodo:async (req,res)=>{
        try {
            const {id} = req.params;
            if(!id){
                return res.status(400).json({
                    success: false,
                    error: 'Id is required'
                });
            }
            const todo = await todoService.deleteTodo(id);
            res.status(200).json({
                success: true,
                message: 'Todo deleted successfully',
                todo
            });
        } catch (error) {
            logger.error('Error in deleteTodo:', error);
            const statusCode = error.message.includes('not found') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    },
    getStatus:async (req,res)=>{
        try {
             const {status} = req.params;
          
            if(!status){
                return res.status(400).json({
                    success: false,
                    error: 'Status is required'
                });
            }
            const statusTodo = await todoService.getStatus(status);
            const statusCount = statusTodo.length;
            res.status(200).json({
                success:true,
                status,
                statusCount
            })
          
        } catch (error) {
            logger.error('Error in getStatus:', error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    },
    toggleStatus:async (req,res)=>{
        try {
            const {status} =req.params;
            if(!status){
                return res.status(400).json({
                    success: false,
                    error: 'Status is required'
                });
            }
            const todo = await todoService.toggleStatus(status);
            res.status(200).json({
                success:true,
                todo
            })  
          
        } catch (error) {
            logger.error('Error in toggleStatus:', error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        }   
    }
}

export default todoController;