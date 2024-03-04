import  express  from "express";
import cors from 'cors';
import { userRouter } from "./routes/user.routes";
import { CategoryRouter } from "./routes/category.routes";
import { ExpenseRouter } from "./routes/expense.routes";

const app=express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded())

app.use('/api/user',userRouter);
app.use('/api/category',CategoryRouter);
app.use('/api/expense',ExpenseRouter);

export default app;