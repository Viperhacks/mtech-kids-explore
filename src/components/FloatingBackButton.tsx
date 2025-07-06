import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const FloatingBackButton = () => {
  return (
   <div className="fixed bottom-4 right-4 z-50">
        <Button
        size='lg'
        className='rounded-full shadow-md bg-mtech-primary text-white hover:bg-mtech-dark transition'
        >
            <Link to={"/dashboard"} aria-label='Back to dashboard' className=' flex items-center'>
            <ArrowLeft className='h-5 w-5 mr-2'/>
            Go Back
            </Link>
        </Button>
    </div>
  )
}

export default FloatingBackButton