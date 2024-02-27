import  express  from "express";
import cors from 'cors';
import { userRouter } from "./routes/user.routes";

const app=express();
app.use(express.json())
app.use(cors())
app.use(express.urlencoded())

app.use('/api/user',userRouter);

export default app;