import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { User } from 'next-auth'
import mongoose from 'mongoose'
import { use } from 'react'

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
  const messageId = params.messageid
  await dbConnect()
  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: 'Not Authenticated'
      },
      { status: 401 }
    )
  }

  try {
    const updateResult = await UserModel.updateOne(
      {_id:use._id},
      {$pull: {messages: {_id:messageId}}}
    )

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: 'Message not found'
        },
        { status: 404 }
      )
    }

    return Response.json(
      {
        success: true,
        message: 'Message deleted'
      },
      { status: 200 }
    )
  } catch (error) {
    console.log("Error in delete message route",error)
    return Response.json(
      {
        success: false,
        message: 'Error Deleting Message'
      },
      { status: 500
      }
    )
  }
  
}
