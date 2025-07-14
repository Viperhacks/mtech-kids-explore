import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Book, Award, UserPlus } from 'lucide-react';
import { UserIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const TeachersPage = () => {
  const teachers = [
    {
      id: 1,
      name: "Mrs. Praise Tips",
      subject: "Mathematics",
      bio: "Passionate math teacher with 10+ years of experience making numbers fun for young learners.",
      avatar: "",
      experience: "10+ years",
      grade: "Grade 3-5",
      credentials: "B.Ed Mathematics, M.Ed Educational Technology"
    },
    {
      id: 2,
      name: "Mr. Tadiwa Blessed",
      subject: "Science",
      bio: "Bringing science to life through experiments and exploration. Teaching children to question and discover.",
      avatar: "",
      experience: "8 years",
      grade: "Grade 4-6",
      credentials: "B.Sc Biology, Teaching Certification"
    },
    {
      id: 3,
      name: "Ms. Pauline Tips",
      subject: "English Literature",
      bio: "Fostering a love of reading and writing in children. Creating future authors and poets!",
      avatar: "",
      experience: "12 years",
      grade: "Grade 4-7",
      credentials: "M.A. English Literature, B.Ed"
    },
    {
      id: 4,
      name: "Mr. Austine Mukomi",
      subject: "Social Studies",
      bio: "Making history and geography come alive through stories and interactive learning.",
      avatar: "",
      experience: "7 years",
      grade: "Grade 5-7",
      credentials: "B.A. History, Teaching Certification"
    }
  ];

  const renderTeachers = (filter) => {
    const filtered = filter === "all" ? teachers : teachers.filter(t => {
      if (filter === "english") return t.subject === "English Literature";
      return t.subject.toLowerCase() === filter;
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {filtered.map(teacher => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto py-12 px-4 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-mtech-dark mb-4">
          Meet Our Dedicated Teachers
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our experienced educators are passionate about nurturing the next generation of learners through engaging and interactive education.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full mb-8">
        <div className="flex justify-center mb-8">
         <TabsList className="flex flex-wrap justify-center gap-2">
  {[
    { value: "all", label: "All Teachers" },
    { value: "math", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
  ].map((tab) => (
    <TabsTrigger
      key={tab.value}
      value={tab.value}
      className="px-4 py-2 rounded-full border border-mtech-secondary bg-white text-mtech-dark hover:bg-mtech-secondary hover:text-white transition
      data-[state=active]:bg-mtech-secondary data-[state=active]:text-white data-[state=active]:border-mtech-secondary"
    >
      {tab.label}
    </TabsTrigger>
  ))}
</TabsList>

        </div>

        <TabsContent value="all">{renderTeachers("all")}</TabsContent>
        <TabsContent value="math">{renderTeachers("mathematics")}</TabsContent>
        <TabsContent value="science">{renderTeachers("science")}</TabsContent>
        <TabsContent value="english">{renderTeachers("english")}</TabsContent>
      </Tabs>

      <div className="mt-16 bg-gradient-to-br from-mtech-primary/10 to-mtech-secondary/10 rounded-xl p-10 text-center">

        <div className="max-w-3xl mx-auto">
          <UserPlus className="mx-auto h-12 w-12 text-mtech-primary mb-4" />
          <h2 className="text-2xl font-bold text-mtech-dark mb-4">Join Our Teaching Team</h2>
          <p className="text-mtech-dark/80  mb-6">
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
  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden hover:shadow-xl hover:ring-2 hover:ring-mtech-secondary transition duration-300">

        <div className="h-32 bg-gradient-to-r from-mtech-primary to-mtech-secondary"></div>
        <div className="flex justify-center -mt-12">
          <Avatar className="h-24 w-24 border-4 border-white bg-white">
            {teacher.avatar ? (
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
            ) : (
              <AvatarFallback className="flex items-center justify-center text-muted-foreground">
                <UserIcon className="h-8 w-8" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <CardHeader className="text-center pt-4">
          <CardTitle>{teacher.name}</CardTitle>
          <Badge variant="outline" className="mx-auto">
            {teacher.subject}
          </Badge>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <CardDescription>{teacher.bio}</CardDescription>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-mtech-primary/10 p-2 rounded">
  <p className="text-mtech-primary text-xs uppercase">Experience</p>
  <p className="font-semibold text-mtech-dark">{teacher.experience}</p>
</div>

            <div className="bg-mtech-primary/10 p-2 rounded">
              <p className="text-mtech-primary text-xs uppercase">Grades</p>
              <p className="font-semibold text-mtech-dark">{teacher.grade}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TeachersPage;
