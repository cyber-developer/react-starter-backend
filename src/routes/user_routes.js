import express from 'express';
import userController from '../controllers/user_controllers';
const router = express.Router(); //-- creating router

//============================= BASE CALLS
router.route('/')
    // POST /users registration
    .post( userController.create )
    // GET /users
    .get( userController.getAll );

//-============== BASE CALLS

router.route('/login')
    //POST /login
    .post( userController.login);

// ============== BASE CALLS

router.route('/reset-password')
    //POST /reset-password
    .post( userController.resetPassword );

export default router;