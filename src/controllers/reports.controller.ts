import { Request,Response } from "express";
import { Expense, ExpenseDocument } from "../models/expense.model";

const getCategoryWiseReportDaywise = async (req: Request, res: Response) => 
{    
    let date1=new Date(req.body.date);
    const userId= req.headers.userId;
    try{
        const categoryReport = await Expense.aggregate([
            {
                $match:{
                    createdBy:userId,
                    date:date1
                }
            },
            {
                $group:{
                    _id:"$categoryId",
                    totalAmount:{$sum:"$amount"}
                }
            },
            {
                $lookup:{
                    from:"categories",
                    localField:"_id",
                    foreignField:"_id",
                    as:"category"                    
                }
            },
            {   
                $unwind:"$category"
            },
            {
                $project:{
                    _id:0,
                    category:"$category.categoryName",
                    totalAmount:1
                }
            }            
        ]);
        // const categoryReport=await Expense.find({date:date1});
        // console.log(categoryReport)
        const expenses = await Expense.find({ date: date1, createdBy: userId }).populate('categoryId', 'categoryName').sort({date:1});

        if (expenses.length > 0) {
          let arr:any = expenses.map(ele => ({
            _id: ele._id,
            amount: ele.amount,
            description: ele.description,
            date: ele.date,
            categoryName: (ele.categoryId as any).categoryName
          }));
          // console.log(arr);
          const data = { categoryReport, expenses:arr };
          res.status(200).json({success:true,data});
        }
        else
        {
          const data = { categoryReport, expenses };
          // console.log(data);
          res.status(200).json({success:false,data});
        }

    }catch(err)
    {
        console.log(err);
        res.status(500).json({success:false,message:"Internal Server Error"});    
    }
}

const getCategoryWiseReportMonth = async (req: Request, res: Response) => {
    let date1 = new Date(req.body.month);
    const userId = req.headers.userId;
  
    try {

      const startDate = new Date(date1.getFullYear(), date1.getMonth(), 1); // Set start date of the month
      const endDate = new Date(date1.getFullYear(), date1.getMonth() + 1, 0); // Set end date of the month (day before next month)
  
      const categoryReport = await Expense.aggregate([
        {
          $match: {
            createdBy: userId,
            date: { $gte: startDate, $lt: endDate } // Match date between start and end of month
          }
        },
        {
          $group: {
            _id: "$categoryId",
            totalAmount: { $sum: "$amount" }
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        },
        {
          $project: {
            _id: 0,
            category: "$category.categoryName",
            totalAmount: 1
          }
        }
      ]);
  
      const expenses = await Expense.find({
        date: { $gte: startDate, $lt: endDate }, // Match date between start and end of month
        createdBy: userId
      }).populate('categoryId', 'categoryName').sort({date:1});
  
      if (expenses.length > 0) {
        let arr:any = expenses.map(ele => ({
          _id: ele._id,
          amount: ele.amount,
          description: ele.description,
          date: ele.date,
          categoryName: (ele.categoryId as any).categoryName
        }));
        // console.log(arr);
        const data = { categoryReport, expenses:arr };
        res.status(200).json({success:true,data});
      }
      else
      {
        const data = { categoryReport, expenses };
        // console.log(data);
        res.status(200).json({success:false,data});
      }

    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };


  const getCategoryWiseReportYear = async (req: Request, res: Response) => {
    let date1 = new Date(req.body.year);
    const userId = req.headers.userId;
  
    try {
      const startDate = new Date(date1.getFullYear(), 0, 1); // Set start date of the year (Jan 1st)
      const endDate = new Date(date1.getFullYear() + 1, 0, 1); // Set end date of the year (next year's Jan 1st)
  
      const categoryReport = await Expense.aggregate([
        {
          $match: {
            createdBy: userId,
            date: { $gte: startDate, $lt: endDate } // Match date between start and end of year
          }
        },
        {
          $group: {
            _id: "$categoryId",
            totalAmount: { $sum: "$amount" }
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        },
        {
          $project: {
            _id: 0,
            category: "$category.categoryName",
            totalAmount: 1
          }
        }
      ]);
  
      const expenses = await Expense.find({
        date: { $gte: startDate, $lt: endDate }, // Match date between start and end of year
        createdBy: userId
      }).populate('categoryId', 'categoryName').sort({date:1});
  
       if (expenses.length > 0) {
          let arr:any = expenses.map(ele => ({
            _id: ele._id,
            amount: ele.amount,
            description: ele.description,
            date: ele.date,
            categoryName: (ele.categoryId as any).categoryName
          }));
          // console.log(arr);
          const data = { categoryReport, expenses:arr };
          res.status(200).json({success:true,data});
        }
        else
        {
          const data = { categoryReport, expenses };
          // console.log(data);
          res.status(200).json({success:false,data});
        }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
const getCategoryWiseReportRangedate = async (req: Request, res: Response) => {
  
  try{
    const userId= req.headers.userId;
    const [startDate, endDate] = req.body.dates;
    // console.log("start date : ",startDate);
    // console.log("end date : ",endDate);
    let date1=new Date(startDate);
    let date2=new Date(endDate);
    // console.log("date1 : ",date1);
    // console.log("date2 : ",date2);
    // console.log("checking dates")
    if (date1.getTime() === date2.getTime()) {
      // console.log("date1 and date2 are the same (same day)");
      req.body.date = date1;
     return getCategoryWiseReportDaywise(req,res);
    }

    const categoryReport = await Expense.aggregate([
        {
          $match: {
            createdBy: userId,
            date: { $gte: date1, $lt: date2 } // Match within date range
          }
        },
        {
            $group:{
                _id:"$categoryId",
                totalAmount:{$sum:"$amount"}
            }
        },
        {
            $lookup:{
                from:"categories",
                localField:"_id",
                foreignField:"_id",
                as:"category"                    
            }
        },
        {   
            $unwind:"$category"
        },
        {
            $project:{
                _id:0,
                category:"$category.categoryName",
                totalAmount:1
            }
        }            
    ]);
    // const categoryReport=await Expense.find({date:date1});
    // console.log(categoryReport)

    const expenses = await Expense.find({
      date: { $gte: date1, $lt: date2 },
      createdBy: userId
    }).populate('categoryId', 'categoryName').sort({date:1});

    // console.log(expenses);

    if (expenses.length > 0) {
      let arr:any = expenses.map(ele => ({
        _id: ele._id,
        amount: ele.amount,
        description: ele.description,
        date: ele.date,
        categoryName: (ele.categoryId as any).categoryName
      }));
      // console.log(arr);
      const data = { categoryReport, expenses:arr };
      res.status(200).json({success:true,data});
    }
    else
    {
      const data = { categoryReport, expenses };
      // console.log(data);
      res.status(200).json({success:false,data});
    }

}catch(err)
{
    console.log(err);
    res.status(500).json({success:false,message:"Internal Server Error"});    
}

}

export { getCategoryWiseReportDaywise , getCategoryWiseReportMonth,getCategoryWiseReportYear,getCategoryWiseReportRangedate};
