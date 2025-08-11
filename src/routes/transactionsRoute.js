import express from 'express';
import { sql } from '../config/db.js';
import { 
    getTransactionByUserId,
    createTransaction,
    deleteTransaction,
    getTransactionSummary
} from '../controllers/transactionsController.js';

const router = express.Router();


router.get("/:userid", getTransactionByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userid", getTransactionSummary);

export default router;