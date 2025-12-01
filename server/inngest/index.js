//import { Prisma } from "@prisma/client";
import  prisma from "../configs/prisma.js"
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-mgt" });
//Inngest function to save data to my database
const syncUserCreation=inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{
        const {data}=event
        await prisma.user.create({data:{
            id:data.id,
            email:data?.email_addresses[0]?.email_address,
            name:data?.first_name +" " + data?.last_name,
            image:data?.image_url,
        }})
    }
)
///Inngest user Deletion
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("DELETION EVENT RECEIVED:", event);

    const userId =
      event?.data?.id || event?.user_id || event?.data?.user_id;

    console.log("USER ID TO DELETE:", userId);

    await prisma.user.deleteMany({
      where: { id: userId },
    });
  }
);

//sync user updation 
const syncUserUpdation=inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async({event})=>{
        const {data}=event
        await prisma.user.update({
            where:{id:data.id},
            data:{
            
            email:data?.email_addresses[0]?.email_address,
            name:data?.first_name +" " + data?.last_name,
            image:data?.image_url,
        }})
    }
)
//inest functon to sync workspace creation

const syncWorkspaceCreation=inngest.createFunction(
    {id:'sync-workspace-from-clerk'},
    {event:'clerk/workspace.created'},
    async({event})=>{
        const {data}=event
        await prisma.workspace.create({
            data:{
            id:data.id,
            name:data.name,
            ownerId:data.created_by ,
            slug:data.slug,
            image:data.image_url,
        }})
        // Add creator as admin member of the workspace
        await prisma.workspaceMember.create({
            data:{
                userId:data.created_by,
                workspaceId:data.id,
                role:'ADMIN'
            }
        })
    }
)
//inngest function to sync workspace updation
const syncWorkspaceUpdation=inngest.createFunction(
    {id:'update-workspace-from-clerk'},
    {event:'clerk/workspace.updated'},
    async({event})=>{
        const {data}=event
        await prisma.workspace.update({
            where:{id:data.id},
            data:{
            name:data.name,
            slug:data.slug,
            image:data.image_url,
        }})
    }
)
//inngest function to sync workspace deletion
const syncWorkspaceDeletion=inngest.createFunction(
    {id:'delete-workspace-from-clerk'},
    {event:'clerk/workspace.deleted'},
    async({event})=>{
        const {data}=event
        await prisma.workspace.deleteMany({
            where:{id:data.id}
        })
    }
)
//sync worlspaceMember creation 
const syncWorkspaceMemberCreation=inngest.createFunction(
    {id:'sync-workspace-member-from-clerk'},
    {event:'clerk/workspaceInvitation.accepted'}, 
    async({event})=>{
        const {data}=event
        await prisma.workspaceMember.create({
            data:{
            userId:data.user_id,
            workspaceId:data.workspace_id,
            role:String(data.role).toUpperCase(),
        }})
    }
)
// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    syncWorkspaceCreation,
    syncWorkspaceUpdation,
    syncWorkspaceDeletion,
    syncWorkspaceMemberCreation
];