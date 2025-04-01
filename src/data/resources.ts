
const ResourcesData = {
  grades: [
    {
      id: 'grade3',
      name: '3',
      subjects: [
        {
          id: 'mathematics',
          name: 'Mathematics',
          videosCount: 8,
          quizzesCount: 5,
          videos: [
            {
              id: 'math_g3_v1',
              title: 'Introduction to Addition',
              thumbnail: 'https://placehold.co/600x400?text=Addition',
              duration: '10:25',
              teacher: 'Mrs. Johnson'
            },
            {
              id: 'math_g3_v2',
              title: 'Basic Subtraction',
              thumbnail: 'https://placehold.co/600x400?text=Subtraction',
              duration: '9:15',
              teacher: 'Mrs. Johnson'
            },
            {
              id: 'math_g3_v3',
              title: 'Counting Numbers',
              thumbnail: 'https://placehold.co/600x400?text=Counting',
              duration: '8:40',
              teacher: 'Mr. Thompson'
            },
          ],
          quizzes: [
            {
              id: 'math_g3_q1',
              title: 'Addition Quiz',
              questions: 10,
              time: 15,
              description: 'Test your knowledge of basic addition operations.'
            },
            {
              id: 'math_g3_q2',
              title: 'Subtraction Practice',
              questions: 8,
              time: 12,
              description: 'Practice your subtraction skills with these exercises.'
            }
          ]
        },
        {
          id: 'english',
          name: 'English',
          videosCount: 6,
          quizzesCount: 4,
          videos: [
            {
              id: 'eng_g3_v1',
              title: 'Alphabet Sounds',
              thumbnail: 'https://placehold.co/600x400?text=Alphabet',
              duration: '12:30',
              teacher: 'Mrs. Wilson'
            },
            {
              id: 'eng_g3_v2',
              title: 'Simple Sentences',
              thumbnail: 'https://placehold.co/600x400?text=Sentences',
              duration: '11:20',
              teacher: 'Mrs. Wilson'
            }
          ],
          quizzes: [
            {
              id: 'eng_g3_q1',
              title: 'Spelling Test',
              questions: 15,
              time: 20,
              description: 'Test your spelling skills with common words.'
            }
          ]
        },
        {
          id: 'science',
          name: 'Science',
          videosCount: 7,
          quizzesCount: 3,
          videos: [
            {
              id: 'sci_g3_v1',
              title: 'Plants and Their Parts',
              thumbnail: 'https://placehold.co/600x400?text=Plants',
              duration: '14:45',
              teacher: 'Mr. Davis'
            }
          ],
          quizzes: [
            {
              id: 'sci_g3_q1',
              title: 'Plant Parts Quiz',
              questions: 8,
              time: 10,
              description: 'Identify different parts of plants.'
            }
          ]
        },
        {
          id: 'shona',
          name: 'Shona',
          videosCount: 5,
          quizzesCount: 2,
          videos: [
            {
              id: 'sho_g3_v1',
              title: 'Basic Greetings',
              thumbnail: 'https://placehold.co/600x400?text=Shona',
              duration: '8:15',
              teacher: 'Mr. Moyo'
            }
          ],
          quizzes: [
            {
              id: 'sho_g3_q1',
              title: 'Shona Vocabulary',
              questions: 10,
              time: 15,
              description: 'Test your knowledge of basic Shona vocabulary.'
            }
          ]
        }
      ]
    },
    {
      id: 'grade4',
      name: '4',
      subjects: [
        {
          id: 'mathematics',
          name: 'Mathematics',
          videosCount: 10,
          quizzesCount: 6,
          videos: [
            {
              id: 'math_g4_v1',
              title: 'Multiplication Basics',
              thumbnail: 'https://placehold.co/600x400?text=Multiplication',
              duration: '15:10',
              teacher: 'Mrs. Johnson'
            },
            {
              id: 'math_g4_v2',
              title: 'Division Introduction',
              thumbnail: 'https://placehold.co/600x400?text=Division',
              duration: '14:35',
              teacher: 'Mr. Thompson'
            }
          ],
          quizzes: [
            {
              id: 'math_g4_q1',
              title: 'Multiplication Tables',
              questions: 12,
              time: 15,
              description: 'Practice your multiplication tables from 1 to 12.'
            }
          ]
        },
        {
          id: 'english',
          name: 'English',
          videosCount: 8,
          quizzesCount: 5,
          videos: [
            {
              id: 'eng_g4_v1',
              title: 'Reading Comprehension',
              thumbnail: 'https://placehold.co/600x400?text=Reading',
              duration: '16:20',
              teacher: 'Mrs. Wilson'
            }
          ],
          quizzes: [
            {
              id: 'eng_g4_q1',
              title: 'Grammar Quiz',
              questions: 15,
              time: 20,
              description: 'Test your knowledge of basic grammar rules.'
            }
          ]
        }
      ]
    },
    {
      id: 'grade5',
      name: '5',
      subjects: [
        {
          id: 'mathematics',
          name: 'Mathematics',
          videosCount: 12,
          quizzesCount: 7,
          videos: [
            {
              id: 'math_g5_v1',
              title: 'Fractions Introduction',
              thumbnail: 'https://placehold.co/600x400?text=Fractions',
              duration: '18:45',
              teacher: 'Mrs. Johnson'
            }
          ],
          quizzes: [
            {
              id: 'math_g5_q1',
              title: 'Fractions Quiz',
              questions: 10,
              time: 15,
              description: 'Test your understanding of basic fractions.'
            }
          ]
        }
      ]
    },
    {
      id: 'grade6',
      name: '6',
      subjects: [
        {
          id: 'mathematics',
          name: 'Mathematics',
          videosCount: 14,
          quizzesCount: 8,
          videos: [
            {
              id: 'math_g6_v1',
              title: 'Decimals and Percentages',
              thumbnail: 'https://placehold.co/600x400?text=Decimals',
              duration: '20:15',
              teacher: 'Mr. Thompson'
            }
          ],
          quizzes: [
            {
              id: 'math_g6_q1',
              title: 'Percentages Quiz',
              questions: 12,
              time: 18,
              description: 'Test your understanding of percentages and conversions.'
            }
          ]
        }
      ]
    },
    {
      id: 'grade7',
      name: '7',
      subjects: [
        {
          id: 'mathematics',
          name: 'Mathematics',
          videosCount: 16,
          quizzesCount: 9,
          videos: [
            {
              id: 'math_g7_v1',
              title: 'Algebra Introduction',
              thumbnail: 'https://placehold.co/600x400?text=Algebra',
              duration: '22:30',
              teacher: 'Mrs. Johnson'
            }
          ],
          quizzes: [
            {
              id: 'math_g7_q1',
              title: 'Basic Algebra Quiz',
              questions: 15,
              time: 25,
              description: 'Test your understanding of basic algebraic concepts.'
            }
          ]
        }
      ]
    }
  ]
};

export default ResourcesData;
