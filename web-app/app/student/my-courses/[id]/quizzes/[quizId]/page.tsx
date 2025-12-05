"use client";
import TakeTest from "@/app/components/course/TakeTest";
import { use } from "react";

interface TakeQuizProps {
  params: Promise<{ id: string; quizId: string }>;
}

const TakeQuiz = ({ params }: TakeQuizProps) => {
  const { id, quizId } = use(params);
  return <TakeTest courseId={id} testId={quizId} testType="QUIZ" />;
};

export default TakeQuiz;
