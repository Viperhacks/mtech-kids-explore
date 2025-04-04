
import React from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DefaultLoginInfo: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="rounded-md border p-4 mt-8">
      <h3 className="text-lg font-medium mb-4">Demo Login Credentials ({currentYear})</h3>
      <p className="text-sm text-gray-500 mb-4">
        Use these credentials to test different user roles in the application:
      </p>
      
      <Table>
        <TableCaption>Demo accounts for testing purposes only</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Password</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Student</TableCell>
            <TableCell>student@example.com</TableCell>
            <TableCell>password123</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Teacher</TableCell>
            <TableCell>teacher@example.com</TableCell>
            <TableCell>password123</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Parent</TableCell>
            <TableCell>parent@example.com</TableCell>
            <TableCell>password123</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Admin</TableCell>
            <TableCell>admin@example.com</TableCell>
            <TableCell>admin123</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> These credentials are for demonstration purposes only. In a production environment, 
          you would use real authentication with secure passwords.
        </p>
      </div>
    </div>
  );
};

export default DefaultLoginInfo;
