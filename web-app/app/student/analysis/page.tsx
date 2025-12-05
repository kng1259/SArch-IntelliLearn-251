"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Award, Calendar, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import analyticsService from "@/lib/services/analyticsService";

const AnalysisPage = () => {
  const router = useRouter();

  const handleDownloadYearReport = async () => {
    const res = await analyticsService.getStudentAnalyticsYearly();

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yearly-learning-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMonthReport = async () => {
    const res = await analyticsService.getStudentAnalyticsMonthly();

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "monthly-learning-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/student/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Analysis report</h1>
          <p className="text-gray-600">Overview of your academic performance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Download your report here</CardTitle>
            <CardDescription>
              Insights into your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button className="hover:bg-gray-300 transition-all duration-500" variant={"outline"} onClick={handleDownloadYearReport}>
                <Calendar className="w-4 h-4 mr-2" />
                Yearly Report
              </Button>
              <Button className="hover:bg-gray-300 transition-all duration-500" variant={"outline"} onClick={handleDownloadMonthReport}>
                <FileText className="w-4 h-4 mr-2" />
                Monthly Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AnalysisPage;
