import { FC } from "react";
import { BadgeCheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsProps {}

const Stats: FC<StatsProps> = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Silver</CardTitle>
          <BadgeCheckIcon strokeWidth={1.5} fill="#C0C0C0" />
        </CardHeader>
        <CardContent>
          <div className="line-clamp-1 text-2xl font-bold">$45,23.89</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gold</CardTitle>
          <BadgeCheckIcon strokeWidth={1.5} fill="#FFD700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Diamond</CardTitle>
          <BadgeCheckIcon strokeWidth={1.5} fill="#1DA1F2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="size-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
