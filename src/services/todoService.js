import Todo from '../models/Todo.js';
import { logger } from '../utils/logger.js';

const todoService ={
    getTodos:async ()=>{
        try {
            const todos = await Todo.find().sort({createAt:-1});
            return todos;
            
        } catch (error) {
            logger.error('Error in getTodos:', error);
            throw new Error(`Error fetching todos: ${error.message}`);
        }
        
    },
    getTodo:async (id)=>{
        try {
            const todo = await Todo.findById(id);
            if(!todo){
                throw new Error(`Todo with id ${id} not found`);
            }
            return todo;
            
        } catch (error) {
            logger.error('Error in getTodo:', error);
            throw new Error(`Error fetching todo: ${error.message}`);
        }
        
    },
    createTodo:async ({title, description, status})=>{
        try {
            if(!title || !title.trim()){
                throw new Error('Title is required');
            }
            const newTodo = await Todo.create({
                title,
                description: description || "",
                status: status || "pending"
            });
            return newTodo;
            
        } catch (error) {
            logger.error('Error in createTodo:', error);
            throw new Error(`Error creating todo: ${error.message}`);
            
        }
       
        
    },
    
    updateTodo:async (id,title,description)=>{
        try {
            if(!id){
                throw new Error('Id is required');
            }
            if(!title){
                throw new Error('Title is required');
            }
            const todo = await Todo.findByIdAndUpdate(id,{
                title,
                description:description || ""
            });
            return await todo.save();
            
        } catch (error) {
            logger.error('Error in updateTodo:', error);
            throw new Error(`Error updating todo: ${error.message}`);
            
        }
        
    },
    deleteTodo:async (id)=>{
        try {
            if(!id){
                throw new Error('Id is required');
            }
            const todo = await Todo.findByIdAndDelete(id);
            if (!todo) {
                throw new Error(`Todo with id ${id} not found`);
            }
            return todo;
        } catch (error) {
            logger.error('Error in deleteTodo:', error);
            throw new Error(`Error deleting todo: ${error.message}`);
        }
    },
    getStatus:async (status)=>{
        try {
            const statusTodo = await Todo.find({status}).sort({createAt:-1});
            return statusTodo;
        } catch (error) {
            logger.error('Error in getStatus:', error);
            throw new Error(`Error fetching todos: ${error.message}`);
        }
    },
    toggleStatus:async (status)=>{
        try {
            const toggleStatusTodo = await Todo.find({status}).sort({createAt:-1});
            for(let todo of toggleStatusTodo){
                await todo.updateOne({status:status});
            }
            return await toggleStatusTodo;
            
            
        } catch (error) {
            logger.error('Error in toggleStatus:', error);
            throw new Error(`Error toggling status: ${error.message}`);
            
        }
    }
}
export default todoService;
