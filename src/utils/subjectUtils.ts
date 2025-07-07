
export const subjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'English' },
  { id: 3, name: 'Science' },
  { id: 4, name: 'ICT' },
  { id: 5, name: 'Agriculture' },
  { id: 6, name: 'Shona' },
  { id: 7, name: 'Physical Education' },
  { id: 8, name: 'Social Studies' } 
]


export const getSubjectById = (id: number) => {
  return subjects.find(subject => subject.id === id);
};

export const getSubjectNameById = (id: number): string => {
  const subject = subjects.find(subject => subject.id === id);
  return subject ? subject.name : '';
};

export const getSubjectByName = (name: string) => {
  return subjects.find(subject => subject.name.toLowerCase() === name.toLowerCase());
};
