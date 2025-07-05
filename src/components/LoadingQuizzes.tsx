import { Loader2 } from 'lucide-react'
import React from 'react'

const LoadingQuizzes = () => {
  return (
    <div className="mtech-container py-20 flex flex-col items-center justify-center">
        {/* Fun spinning loader */}
        <div className="loader-spin">
          <Loader2 className="h-16 w-16 text-mtech-primary" />
        </div>
  
        {/* Kid-friendly message */}
        <p className="mt-6 text-mtech-dark text-xl font-semibold text-center">
          Hang tight! We're gathering some fun learning quizzes just for you!
        </p>
  
        {/* Fun encouragement */}
        <p className="mt-4 text-mtech-dark text-lg text-center">Almost there... Let's get ready to explore! 🚀</p>
      </div>
  )
}

export default LoadingQuizzes