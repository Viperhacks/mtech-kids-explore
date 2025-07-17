
export const subjects = [
  { id: 1, name: 'Mathematics' }, 
  { id: 2, name: 'English' }, 
  { id: 3, name: 'Social Science' }, 
  { id: 4, name: 'Agriculture Science and Technology' },  
  { id: 5, name: 'Shona' },
  { id: 6, name: 'PE & VPA' } 
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
