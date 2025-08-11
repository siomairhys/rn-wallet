import { sql } from "../config/db.js";

export async function getTransactionByUserId(req, res) {
    try {
        const { userid } = req.params;

                const transactions = await sql`
                 SELECT * FROM transactions WHERE user_id = ${userid}
                `;
    
                res.status(200).json(transactions);
            } catch (error) {
                console.log("Error fetching transactions:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
}

export async function createTransaction(req, res) {
    try {
            const { title, amount, category, user_id } = req.body;

            if (!title || !category || !user_id || amount === undefined) {
                return res.status(400).json({ error: "All fields are required" });
            }
    
            const transaction = await sql`
            INSERT INTO transactions(user_id,title,amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
            `;
    
            console.log(transaction);
            res.status(201).json(transaction[0]);
    
            } catch (error) {
                console.log("Error creating transaction:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        
}

export async function deleteTransaction(req, res) {
            try {
                const { id } = req.params;
    
                const numId = Number(id);
                if (!Number.isInteger(numId) || numId <= 0) {
                    return res.status(400).json({ message: "Invalid transaction ID" });
                }
    
                const result = await sql`
                    DELETE FROM transactions WHERE id = ${numId}
                    RETURNING *
                `;
    
                if (result.length === 0) {
                    return res.status(404).json({ message: "Transaction not found" });
                }
    
                res.status(200).json({ message: "Transaction deleted successfully" });
            } catch (error) {
                console.log("Error deleting transaction:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
}

export async function getTransactionSummary(req, res) {
            try {
            const { userid } = req.params;

            const balanceResult = await sql`
                SELECT COALESCE(SUM(amount), 0) as balance 
                FROM transactions 
                WHERE user_id = ${userid}
            `;

            const incomeResult = await sql`
                SELECT COALESCE(SUM(amount), 0) as income
                FROM transactions
                WHERE user_id = ${userid} AND amount > 0
            `;

            const expensesResult = await sql`
                SELECT COALESCE(SUM(amount), 0) as expenses
                FROM transactions
                WHERE user_id = ${userid} AND amount < 0
            `;

            const summary = {
                balance: balanceResult[0].balance,
                income: incomeResult[0].income,
                expenses: expensesResult[0].expenses
            };

            res.status(200).json(summary);
        } catch (error) {
            console.log("Error fetching transaction summary:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
}