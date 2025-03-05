import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Calendar,
  HourglassIcon,
  PieChart,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Technician Header Component
function TechnicianHeader({ technician }) {
  if (!technician || !technician.user) return null;

  return (
    <Card className="w-full mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden shadow-md">
              {technician.user.thumbnail ? (
                <img
                  src={technician.user.thumbnail}
                  alt={technician.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#00A8E8] text-4xl font-semibold">
                  {technician.user.name?.charAt(0) || "T"}
                </span>
              )}
            </div>
            {technician.user.isVerified === "yes" && (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-900">
              {technician.user.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">
                {technician.user.role?.[0] || "Technician"}
              </Badge>
              <Badge
                variant={
                  technician.user.status === "active"
                    ? "default"
                    : "destructive"
                }
              >
                {technician.user.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Contact Information Component
function ContactInformation({ technician }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col gap-4 md:flex-row md:justify-around items-center">
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold">{technician.user.phone || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Mail className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{technician.user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MapPin className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold">{technician.user.location || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Project Metrics Component
function ProjectMetrics({ technicianData }) {
  const metrics = [
    {
      count: technicianData?.completedProject || 0,
      label: "Completed Projects",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      count: technicianData?.ongoingProject || 0,
      label: "Ongoing Projects",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      count: technicianData?.upcomingProjects || 0,
      label: "Upcoming Projects",
      icon: Calendar,
      color: "text-purple-500",
    },
    {
      count: technicianData?.pendingProjects || 0,
      label: "Pending Projects",
      icon: HourglassIcon,
      color: "text-yellow-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map(({ count, label, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <Icon className={`${color} w-6 h-6`} />
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-800">{count}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TechnicianDetails() {
  const { id } = useParams();
  const [technicianData, setTechnicianData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnicianDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://beta.techskims.tech/api/admin/technicians/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data && response.data.data) {
          setTechnicianData(response.data.data);
        } else {
          throw new Error("No technician data received");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching technician details:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          window.location.href = "/login";
        } else {
          setError(
            error.response?.data?.message ||
              "Failed to fetch technician details"
          );
          toast.error(
            error.response?.data?.message ||
              "Failed to fetch technician details"
          );
        }
        setLoading(false);
      }
    };

    if (id) {
      fetchTechnicianDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading technician details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute md:relative h-screen overflow-y-scroll pb-10 scrollbar-custom pt-10">
      <style jsx>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <div className=" mx-auto space-y-6">
        <TechnicianHeader technician={technicianData} />
        <ProjectMetrics technicianData={technicianData} />

        <div className="">
          <ContactInformation technician={technicianData} />
        </div>
      </div>
    </div>
  );
}
