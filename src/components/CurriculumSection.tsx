import React, { useState } from "react";
import { GraduationCap, Book, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { curriculumConfig, GradeKey } from "@/utils/curriculmnConfig";
import { getSubjectNameById } from "@/utils/subjectUtils";

const CurriculumSection: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const grades = Object.keys(curriculumConfig) as GradeKey[];

  const handleResourceClick = (gradeId: string, subjectId?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in to access this resource.",
        duration: 3000,
      });
      // Set a state to show login modal when redirected to home
      navigate("/", { state: { showLogin: true } });
      return;
    }

    // If authenticated, navigate to the appropriate resource
    if (subjectId) {
      navigate(`/dashboard`);
    } else {
      navigate(`/dashboard`);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5">
      <div className="mtech-container">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-mtech-secondary font-kids flex items-center justify-center gap-2">
            🎓 Our Curriculum
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive curriculum designed to engage and educate
            primary school students through interactive videos and exercises.
          </p>
        </div>

        <Tabs defaultValue={grades[3]} className="w-full">
          <TabsList
            className="w-full flex overflow-x-auto gap-2 pb-2 mb-6 h-14 
             no-scrollbar scroll-smooth whitespace-nowrap snap-x snap-mandatory"
          >
            {grades.map((g) => (
              <TabsTrigger
                key={g}
                value={g}
                className="snap-start flex-shrink-0 px-4 py-2 rounded-full border border-mtech-secondary hover:border-mtech-primary bg-white text-mtech-dark hover:bg-mtech-primary hover:text-white transition 
             data-[state=active]:bg-mtech-secondary data-[state=active]:text-white data-[state=active]:border-mtech-secondary"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                {g}
              </TabsTrigger>
            ))}
          </TabsList>

          {grades.map((grade) => {
            const { id, subjects } = curriculumConfig[grade];
            return (
              <TabsContent key={grade} value={grade}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map(({ subjectId, videoCount, quizCount }) => {
                    const name = getSubjectNameById(subjectId);
                    return (
                      <div
                        key={subjectId}
                        className="mtech-card bg-gradient-to-br from-mtech-primary/10 to-mtech-secondary/10  p-6 relative"
                      >
                        {!isAuthenticated && (
                          <div className="absolute top-3 right-3">
                            <Lock className="h-5 w-5 text-mtech-warning" />
                          </div>
                        )}

                        <div className="flex items-start mb-4">
                          <div className="mr-4 mt-1">
                            <Book className="h-5 w-5 text-mtech-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {videoCount} Videos • {quizCount} Quizzes
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-sm hover:bg-mtech-accent"
                            onClick={() =>
                              handleResourceClick(id, String(subjectId))
                            }
                          >
                            Watch Videos
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-mtech-secondary text-white hover:bg-sky-600 text-sm"
                            onClick={() =>
                              handleResourceClick(id, String(subjectId))
                            }
                          >
                            Try Quizzes
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default CurriculumSection;
