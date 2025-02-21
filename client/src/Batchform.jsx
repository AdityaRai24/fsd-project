import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  subject: z.string(),
  students: z.array(z.string()),
  experiments: z.array(z.string()),
});

const Batchform = () => {
  const form = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      subjects: [],
      students: [],
      experiments: [],
    },
  });

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    console.log("pama");
    axios.get("http://localhost:8000/api/subjects").then((res) => {
      console.log("Fetched subjects:", res.data);
      setSubjects(res.data);
    });
    console.log(subjects);
    axios
      .get("http://localhost:8000/api/students")
      .then((res) => {
        console.log("Fetched students:", res.data);
        setStudents(res.data)});
    // axios.get("/api/experiments").then((res) => setExperiments(res.data));
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    // try {
    //   await axios.post("/api/batches", data);
    //   alert("Batch created successfully");
    // } catch (error) {
    //   console.error(error);
    //   alert("Error creating batch");
    // }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 border rounded-md"
      >
        <div>
          <Label htmlFor="name">Batch Name</Label>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} id="name" placeholder="Enter batch name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Label>Subjects</Label>
          <FormField
            control={form.control}
            name="subjects"
            render={({ field }) => (
              <Select multiple onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormMessage />
        </div>

        <div>
          <Label>Students</Label>
          <FormField
            control={form.control}
            name="students"
            render={({ field }) => (
              <Select multiple onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select students" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.sapId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormMessage />
        </div>

        <div>
          <Label>Experiments</Label>
          <FormField
            control={form.control}
            name="experiments"
            render={({ field }) => (
              <Select multiple onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experiments" />
                </SelectTrigger>
                <SelectContent>
                  {experiments.map((experiment) => (
                    <SelectItem key={experiment._id} value={experiment._id}>
                      {experiment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormMessage />
        </div>

        <Button type="submit">Create Batch</Button>
      </form>
    </Form>
  );
};

export default Batchform;
