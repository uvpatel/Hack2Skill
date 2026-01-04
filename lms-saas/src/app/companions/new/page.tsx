import React from 'react'
import  CompanionForm from '@/components/CompanionForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
const NewCompanion = async() => {
  const { userId} = await auth()
  if(!userId) redirect('/sign-in')

  return (
    <main className='lg:w-1/3 mid-md:w-2/3 items-center justify-center'>
      <article className='w-full gap-4 flex flex-col'>
        <h1>Companion Builder</h1>

        <CompanionForm />
      </article>
    </main>
  )
}

export default NewCompanion
