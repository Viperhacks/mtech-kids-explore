
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAllUsers, getActiveUsers, getUsageMetrics } from '@/services/apiService';
import { User, Clock, Users } from 'lucide-react';

const UserActivity = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [timeRange, setTimeRange] = useState('week');
  const [usageData, setUsageData] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    new: 0,
    teachers: 0,
    students: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get usage metrics
      const metricsResponse = await getUsageMetrics(timeRange);
      setUsageData(metricsResponse.data || []);
      
      // Get user stats
      const usersResponse = await getAllUsers(1, 1); // Just to get total count
      const activeUsersResponse = await getActiveUsers(timeRange);
      
      setUserStats({
        total: usersResponse.total || 0,
        active: activeUsersResponse.data?.activeCount || 0,
        new: activeUsersResponse.data?.newCount || 0,
        teachers: usersResponse.teacherCount || 0,
        students: usersResponse.studentCount || 0
      });
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">User Activity</CardTitle>
          <CardDescription>Monitor user engagement and platform usage</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Clock className="h-4 w-4 mr-2" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="engagement">
              <User className="h-4 w-4 mr-2" />
              Engagement
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-muted-foreground text-sm">Total Users</h3>
                <p className="text-2xl font-bold">{userStats.total}</p>
              </div>
              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-muted-foreground text-sm">Active Users</h3>
                <p className="text-2xl font-bold">{userStats.active}</p>
                <p className="text-xs text-muted-foreground">
                  {timeRange === 'day' ? 'Today' : 
                   timeRange === 'week' ? 'This week' : 
                   timeRange === 'month' ? 'This month' : 'This year'}
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-muted-foreground text-sm">New Users</h3>
                <p className="text-2xl font-bold">{userStats.new}</p>
                <p className="text-xs text-muted-foreground">
                  {timeRange === 'day' ? 'Today' : 
                   timeRange === 'week' ? 'This week' : 
                   timeRange === 'month' ? 'This month' : 'This year'}
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border shadow-sm">
                <h3 className="text-muted-foreground text-sm">User Types</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Teachers</p>
                    <p className="text-lg font-bold">{userStats.teachers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="text-lg font-bold">{userStats.students}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <p>Loading user data...</p>
                </div>
              ) : usageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usageData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newUsers" name="New Users" fill="#4f46e5" />
                    <Bar dataKey="activeUsers" name="Active Users" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p>No user data available for the selected time period.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="pt-4">
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <p>Loading session data...</p>
                </div>
              ) : usageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usageData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" name="Number of Sessions" fill="#16a34a" />
                    <Bar dataKey="avgSessionTime" name="Avg. Session Duration (min)" fill="#84d8a8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p>No session data available for the selected time period.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="pt-4">
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <p>Loading engagement data...</p>
                </div>
              ) : usageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usageData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="resourceViews" name="Resource Views" fill="#f59e0b" />
                    <Bar dataKey="quizStarts" name="Quiz Attempts" fill="#fbbf24" />
                    <Bar dataKey="quizCompletions" name="Quiz Completions" fill="#fcd34d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p>No engagement data available for the selected time period.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserActivity;
