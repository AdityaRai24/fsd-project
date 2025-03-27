import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        password,
        role,
        ...(role === "student" ? { sapId: userId } : { teacherId: userId }),
      };

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        payload
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem(role === "student" ? "sapId" : "teacherId", userId);

      if (response.data.role === "student") {
        navigate(`/student-dashboard`);
      } else {
        navigate(`/teacher-dashboard`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getIdLabel = () => {
    return role === "student" ? "SAP ID" : "Teacher ID";
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setRole(value);
    setUserId("");
    setError("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <Tabs value={role} onValueChange={handleTabChange} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="student" className="font-medium">
                Student
              </TabsTrigger>
              <TabsTrigger value="teacher" className="font-medium">
                Teacher
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <TabsContent value="student">
                <div className="space-y-2">
                  <Label htmlFor="sapId">SAP ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="sapId"
                      placeholder="Enter your SAP ID"
                      className="pl-10 h-11"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="teacher">
                <div className="space-y-2">
                  <Label htmlFor="teacherId">Teacher ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="teacherId"
                      placeholder="Enter your Teacher ID"
                      className="pl-10 h-11"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
