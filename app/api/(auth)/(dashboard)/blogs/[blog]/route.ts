import connect from "@/app/lib/db";
import User from "@/app/lib/modals/users";
import Category from "@/app/lib/modals/category";
import Blog from "@/app/lib/modals/blog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";


export const GET = async (request: Request,{ params }: { params: Promise<{ blog: string }> }) => {
    const blogId = (await params).blog;
    try {

        const {searchParams} = new URL (request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");
        if(!userId || !Types.ObjectId.isValid(userId)){
             return new NextResponse(JSON.stringify(
                {message:"Invalid User Id"}),{
                status:400,
            });
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
             return new NextResponse(JSON.stringify(
                {message:"Invalid Category Id"}),{
                status:400,
            });
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)){
             return new NextResponse(JSON.stringify(
                {message:"Invalid Blog Id"}),{
                status:400,
            });
        }
        await connect();
        const user = await User.findById(userId);
        if(!user){
             return new NextResponse(JSON.stringify(
                {message:"User not found"}),{
                status:404,
            });
        }
        const category = await Category.findById(categoryId);
        if(!category){
             return new NextResponse(JSON.stringify(
                {message:"Category not found"}),{
                status:404,
            });
        }

        const blog = await Blog.findOne({
            _id : blogId,
            user : userId,  
            category : categoryId,
        });
        if(!blog){
             return new NextResponse(JSON.stringify(
                {message:"Blog not found"}),{
                status:404,
            });
        }

        return new NextResponse(JSON.stringify({blog}),{
            status:200,
        }); 


    }catch (error:any) {
        return new NextResponse("Error in fatching a blog" + error.message, { status: 500 });
    }
};


export const PATCH = async (request: Request,{ params }: { params: Promise<{ blog: string }> }) => {
    const blogId = (await params).blog;
 
    try{
        const body = await request.json();
        const {title, description   } = body;
        const {searchParams} = new URL (request.url);
        const userId = searchParams.get("userId");
        if(!userId || !Types.ObjectId.isValid(userId)){
             return new NextResponse(JSON.stringify(
                {message:"Invalid User Id"}),{
                status:400,
            });
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)){
                return new NextResponse(JSON.stringify(
                    {message:"Invalid Blog Id"}),{
                    status:400,
                });
        }

        await connect();
        const user = await User.findById(userId);
        if(!user){
             return new NextResponse(JSON.stringify(
                {message:"User not found"}),{
                status:404,
            });
        }   
        const blog = await Blog.findOne({
            _id : blogId,
            user : userId,
        });
        if(!blog){
             return new NextResponse(JSON.stringify(
                {message:"Blog not found"}),{
                status:404,
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {title, description},
            {new : true}
        );

        return new NextResponse(JSON.stringify({message:"Blog is updated", blog: updatedBlog}),{
            status:200,
        });

    }catch(error:any){
        return new NextResponse("Error in updating  blog" + error.message, { status: 500 }); 
    }
};


const DELETE = async (request: Request,{ params }: { params: Promise<{ blog: string }> }) => {
    const blogId = (await params).blog;
    try{
        const {searchParams} = new URL (request.url); 
        const userId = searchParams.get("userId");
        if(!userId || !Types.ObjectId.isValid(userId)){
             return new NextResponse(JSON.stringify(
                {message:"Invalid User Id"}),{
                status:400,
            });
        }
        if(!blogId || !Types.ObjectId.isValid(blogId)){
                return new NextResponse(JSON.stringify(
                    {message:"Invalid Blog Id"}),{
                    status:400,
                });
         }
        await connect();
        const user = await User.findById(userId);
        if(!user){
             return new NextResponse(JSON.stringify(
                {message:"User not found"}),{
                status:404,
            });
        }
        const blog = await Blog.findOne({
            _id : blogId,
            user : userId,
        });
        if(!blog){
             return new NextResponse(JSON.stringify(
                {message:"Blog not found"}),{
                status:404,
            });
        }
        await Blog.findByIdAndDelete(blogId);
        return new NextResponse(JSON.stringify({message:"Blog is deleted"}),{
            status:200,
        });  
    }catch(error:any){
        return new NextResponse("Error in deleting  blog" + error.message, { status: 500 }); 
     }    

};