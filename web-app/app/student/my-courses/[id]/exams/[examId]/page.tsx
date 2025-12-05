"use client";
import TakeTest from "@/app/components/course/TakeTest";
import { use } from "react";

interface TakeQuizProps {
  params: Promise<{ id: string; examId: string }>;
}

const TakeQuiz = ({ params }: TakeQuizProps) => {
  const { id, examId } = use(params);
  return <TakeTest courseId={id} testId={examId} testType="EXAM" />;
};

export default TakeQuiz;
