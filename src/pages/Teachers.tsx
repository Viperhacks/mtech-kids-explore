
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Award, UserPlus } from 'lucide-react';

const TeachersPage = () => {
  // Sample data for teachers
  const teachers = [
    {
      id: 1,
      name: "Mrs. Jane Smith",
      subject: "Mathematics",
      bio: "Passionate math teacher with 10+ years of experience making numbers fun for young learners.",
      avatar: "https://i.pravatar.cc/150?img=32",
      experience: "10+ years",
      grade: "Grade 3-5",
      credentials: "B.Ed Mathematics, M.Ed Educational Technology"
    },
    {
      id: 2,
      name: "Mr. Robert Johnson",
      subject: "Science",
      bio: "Bringing science to life through experiments and exploration. Teaching children to question and discover.",
      avatar: "https://i.pravatar.cc/150?img=65",
      experience: "8 years",
      grade: "Grade 4-6",
      credentials: "B.Sc Biology, Teaching Certification"
    },
    {
      id: 3,
      name: "Ms. Sarah Williams",
      subject: "English Literature",
      bio: "Fostering a love of reading and writing in children. Creating future authors and poets!",
      avatar: "https://i.pravatar.cc/150?img=29",
      experience: "12 years",
      grade: "Grade 4-7",
      credentials: "M.A. English Literature, B.Ed"
    },
    {
      id: 4,
      name: "Mr. David Lee",
      subject: "Social Studies",
      bio: "Making history and geography come alive through stories and interactive learning.",
      avatar: "https://i.pravatar.cc/150?img=68",
      experience: "7 years",
      grade: "Grade 5-7",
      credentials: "B.A. History, Teaching Certification"
    }
  ];
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-mtech-dark mb-4">Meet Our Dedicated Teachers</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our experienced educators are passionate about nurturing the next generation of learners through engaging and interactive education.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-8">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="all">All Teachers</TabsTrigger>
            <TabsTrigger value="math">Mathematics</TabsTrigger>
            <TabsTrigger value="science">Science</TabsTrigger>
            <TabsTrigger value="english">English</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="math">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.filter(t => t.subject === "Mathematics").map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="science">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.filter(t => t.subject === "Science").map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="english">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.filter(t => t.subject === "English Literature").map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 bg-muted rounded-lg p-8 text-center">
        <div className="max-w-3xl mx-auto">
          <UserPlus className="mx-auto h-12 w-12 text-mtech-primary mb-4" />
          <h2 className="text-2xl font-bold mb-4">Join Our Teaching Team</h2>
          <p className="text-muted-foreground mb-6">
            Are you passionate about education and technology? We're always looking for dedicated educators to join our team and help shape the future of learning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center">
              <Book className="h-5 w-5 mr-2 text-mtech-primary" />
              <span>Flexible teaching opportunities</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-mtech-primary" />
              <span>Professional development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherCard = ({ teacher }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-gradient-to-r from-mtech-primary to-mtech-secondary"></div>
      <div className="flex justify-center -mt-12">
        <Avatar className="h-24 w-24 border-4 border-white">
          <AvatarImage src={teacher.avatar} alt={teacher.name} />
          <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
      </div>
      <CardHeader className="text-center pt-4">
        <CardTitle>{teacher.name}</CardTitle>
        <Badge variant="outline" className="mx-auto">{teacher.subject}</Badge>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <CardDescription className="text-center">
          {teacher.bio}
        </CardDescription>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted p-2 rounded">
            <p className="text-muted-foreground">Experience</p>
            <p className="font-medium">{teacher.experience}</p>
          </div>
          <div className="bg-muted p-2 rounded">
            <p className="text-muted-foreground">Grades</p>
            <p className="font-medium">{teacher.grade}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeachersPage;
