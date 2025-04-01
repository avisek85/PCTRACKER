import {Activity} from "../models/Activity.js";
import {startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear} from 'date-fns';
import { normalizeTimeResponse } from "../utils/normalizeTimeResponse.js";

export const fetchAllActivities = async(req,res)=>{
    try {
        //pagination setup default page1 limit 10 records
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit)||10;
        const skip = parseInt(page-1)*limit;

        // fetch acticvities with pagination , sorting , and field selection
        const activities = await Activity
        .find()
        .sort({date:-1})
        .skip(skip)
        .limit(limit)
        .select("-__v"); // exclude version field for cleaner response

        const total = await Activity.countDocuments();
        if(!activities || activities.length === 0){
            return res.status(404).json({
                success:false,
                message:"No activities found",
            });
        }

        console.log("total , limit, totalPages", total, limit, Math.ceil(total/limit));

        // send pagination response
        res.status(200).json({
            success:true,
            total,
            page,
            totalpages:Math.ceil(total/limit),
            data:activities,
        });


    } catch (error) {
        console.error("[Error] failed to fetch activities: ",error);

        // Handle specific Mongodb connection issue
        if(error.name === "MongoNetworkError"){
            return res.status(503).json({
                success:false,
                message:"Database connection error. Please try again later ",
            });
        }
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        });
    }
}

export const fetchSpecificDateActivities = async(req,res)=>{
    try {
        const {date} = req.query;
        if(!date){
            return res.status(400).json({success:false,
                message:"Date parameter is required"
            });
        }

        const activities = await Activity.find({ date });

        if(activities.length === 0){
            return res.status(404).json({success:false, message:"No activities found for the date"});
        }

        res.status(200).json(normalizeTimeResponse(activities, 'date', date));


    } catch (error) {
        console.error("[Error] Failed to fetch daily activities ",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export const fetchSpecificWeekActivity = async(req,res)=>{
    try {
        const {week} = req.query;
        if(!week){
            return res.status(400).json({success:false,
                message:"Week paramter is required"
            })
        }

        //Extract year and week number from the "YYYY-WW" format
        const [year,weekNum] = week.split("-W").map(Number);
        if(!year || !weekNum || weekNum<1 || weekNum>53){
            return res.status(400).json({success:false,
                message:"Invalid week format.Use YYYY-WW format"
            });
        }
         
        // calculate the date range for the week
        const startDate = startOfWeek(new Date(year,0,1),{weekStartsOn:1});
        startDate.setDate(startDate.getDate()+(weekNum-1)*7);
        const endDate = endOfWeek(startDate,{weekStartOn:1});

        /*
        startDate and endDate 
        These are Date objects, but when you log them, they are shown in ISO format by default in the console. However, they are still of type Date.
        */

        //Format dates as string 
        const startStr = startDate.toISOString().split("T")[0];
        const endStr = endDate.toISOString().split("T")[0];

        console.log(`[Info] Fetching activities for the week ${startStr} to ${endStr}`);

        // query mongodb for the week range
        const activities = await Activity.find({
            date:{
                $gte:startStr,
                $lte:endStr
            }
        });
        if(activities.length===0){
            return res.status(404).json({success:false,
                message:"No activities found for the week"
            });
        }

          // Aggregate data day by day
        //   const weeklySummary = {};
        //   activities.forEach(activity =>{
        //       const {date , app, title, startTime, endTime, duration} = activity;
        //       if(!weeklySummary[date]){
        //         weeklySummary[date] = {};
        //       }
        //       if(!weeklySummary[date][app]){
        //         weeklySummary[date][app] = {
        //             totalDuration:0,
        //             logs:[]
        //         };
        //       }
        //       weeklySummary[date][app].totalDuration += duration;
        //       weeklySummary[date][app].logs.push({
        //         title,
        //         startTime,
        //         endTime,
        //         duration
        //       });
        //   });

        //   // prepare structured response
        //   const response = {
        //     success:true,
        //     week,
        //     dateRange:{start:startStr, end:endStr},
        //     totalDays:Object.keys(weeklySummary).length,
        //     weeklySummary
        //   };

          res.status(200).json(normalizeTimeResponse(activities, 'week', week));


    } catch (error) {
        console.error("[Error] Failed to fetch weekly activites: ",error );
        res.staus(500).json({success:false, message:"Internal Server Error"});
    }
};

export const fetchSpecificMonthActivity = async(req,res)=>{
    try {
        const {month} = req.query;
        if(!month){
            return res.status(400).json({
                success:false, message:"Month parameter is required"
            });
        }

        // Validate month format (YYYY-MM)
        const [year, monthNum] = month.split('-').map(Number);
        if(!year || !monthNum || monthNum<1 || monthNum>12){
            return res.status(400).json({success:false, message:"Invalid month format. Use YYYY-MM"});
        }

        // Calculate date range for the month
        const startDate = startOfMonth(new Date(year,monthNum-1));
        //Since new Date(year, month) expects zero-based months, you subtract 1 to align with JavaScript's indexing.
        const endDate = endOfMonth(startDate);

        // Format dates as String 
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        console.log(`[Info] Fetching activities from the ${startStr} to ${endStr}`);

        // query Monmgodb for the monthly range
        const activities = await Activity.find({
            date:{
                $gte:startStr,
                $lte:endStr
            }
        });
        if(activities.length === 0){
            return res.status(404).json({success:false,
                message:"No activities found for the month"
            })
        }

        // // Aggregating data day by day 
        // const monthlySummary = {};
        // activities.forEach(activity =>{
        //     const {date , app , title, startTime, endTime, duration} = activity;
        //     if(!monthlySummary[date]){
        //         monthlySummary[date] = {};
        //     }
        //     if(!monthlySummary[date][app]){
        //         monthlySummary[date][app]={
        //             totalDuration:0,
        //             logs:[],
        //         }
        //     }
        //     monthlySummary[date][app].totalDuration += duration;
        //     monthlySummary[date][app].logs.push({
        //         title,
        //         startTime,
        //         endTime,
        //         duration
        //     })
        // })

        // // prepare structured response
        // const response = {
        //     success:true,
        //     month,
        //     dateRange:{start:startStr,end:endStr},
        //     totalDays:Object.keys(monthlySummary).length,
        //     monthlySummary
        // };
        res.status(200).json(normalizeTimeResponse(activities, 'month', month));



    } catch (error) {
        console.error('[Error] Failed to fetch monthly activities: ', error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}

export const fetchSpecificYearActivity = async(req,res)=>{
    try {
        const {year} = req.query;
      // Validate year parameter
    if (!year || isNaN(year)) {
        return res.status(400).json({
          success: false,
          message: "Valid year parameter is required (e.g., 2023)"
        });
      }
        const yearNum = Number(year);

        // Calculate date range for the year
        const startDate = startOfYear(new Date(yearNum,0,1));
        const endDate = endOfYear(startDate);

        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        // console.log(`[Info] Fetching activities for the year ${yearNum} from ${startStr} to ${endStr}`);

        // Aggregation pipeline group data by month and app
        // const activities = await Activity.aggregate([
        //     {
        //         $match:{
        //             date:{
        //                 $gte:startStr,
        //                 $lte:endStr,
        //             }
        //         },
                
        //     },{
        //         $group:{
        //             _id:{
        //                 month:{$substr:["$date",0,7]},
        //                 app:"$app"
        //             },
        //             totalDuration:{$sum:"$duration"},
        //         }
        //     },{
        //         $sort:{
        //             "_id.month":1,
        //             "totalDuration":-1,
        //         }
        //     }
        // ]);


        // Fetch all activities for the year
    const activities = await Activity.find({
        date: {
          $gte: startStr,
          $lte: endStr
        }
      }).sort({ date: 1 });

        if(activities.length === 0){
            return res.status(404).json({
                success:false,
                message:"No activities found for the year",
            });
        }

       // Create monthly summary for additional context
    const monthlySummary = activities.reduce((acc, activity) => {
        const month = activity.date.substring(0, 7); // YYYY-MM format
        if (!acc[month]) {
          acc[month] = {
            totalDuration: 0,
            appUsage: {}
          };
        }
        acc[month].totalDuration += activity.duration;
        
        if (!acc[month].appUsage[activity.app]) {
          acc[month].appUsage[activity.app] = 0;
        }
        acc[month].appUsage[activity.app] += activity.duration;
        
        return acc;
      }, {});

      // Create normalized response
    const response = {
        ...normalizeTimeResponse(activities, 'year', year),
        monthlySummary,
        dateRange: {
          start: startStr,
          end: endStr
        }
      };
      res.status(200).json(response);
    } catch (error) {
        console.error("[Error] Failed to fetch yearly activities:", error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
        })
    }
}

export const fetchTopUsedApps = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5; // default to top 5 apps
  
      // Aggregation pipeline to get top used apps
      const aggregationResult = await Activity.aggregate([
        {
          $group: {
            _id: "$app",
            totalDuration: { $sum: "$duration" },
            sessions: { 
              $push: {
                title: "$title",
                duration: "$duration",
                date: "$date",
                startTime: "$startTime",
                endTime: "$endTime"
              }
            },
            sessionCount: { $sum: 1 }
          }
        },
        { $sort: { totalDuration: -1 } },
        { $limit: limit }
      ]);
  
      if (aggregationResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No app usage data available"
        });
      }
  
      // Transform to match normalizeTimeResponse structure
      const transformedData = aggregationResult.map(app => ({
        app: app._id,
        duration: app.totalDuration,
        sessions: app.sessions,
        date: app.sessions[0]?.date // Using first session date as reference
      }));
  
      // Create normalized response with additional top apps metadata
      const response = {
        ...normalizeTimeResponse(transformedData, 'topApps', limit),
        metadata: {
          totalApps: aggregationResult.length,
          retrievedAt: new Date().toISOString(),
          limit: limit
        },
        apps: aggregationResult.map(app => ({
          name: app._id,
          totalDuration: app.totalDuration,
          totalSessions: app.sessionCount
        }))
      };
  
      res.status(200).json(response);
  
    } catch (error) {
      console.error("[Error] Failed to fetch top used apps:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
      });
    }
  };



